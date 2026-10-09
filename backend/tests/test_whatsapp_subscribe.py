"""Tests for /api/subscribe WhatsApp wiring and admin subscribers list.

Scope (iteration_4):
- phone validation (422 on < 8 digits)
- subscribe persists whatsapp_* fields regardless of Meta response
- idempotency on duplicate email
- admin /api/subscribers list includes phone + whatsapp_sent
- env wiring for WHATSAPP_* vars (via behavior)
"""
import os
import uuid
import pytest
import requests

def _load_frontend_env_url():
    try:
        with open("/app/frontend/.env") as f:
            for line in f:
                if line.startswith("REACT_APP_BACKEND_URL="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    except Exception:
        pass
    return os.environ.get("REACT_APP_BACKEND_URL", "")

BASE_URL = _load_frontend_env_url().rstrip("/")
assert BASE_URL, "REACT_APP_BACKEND_URL not configured"
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@marilo.cafe"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, f"Admin login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


def _email(tag):
    return f"wa-test-{tag}-{uuid.uuid4().hex[:8]}@example.com"


# ---------- Phone validation ----------
class TestPhoneValidation:
    def test_missing_phone_422(self):
        r = requests.post(f"{API}/subscribe", json={"email": _email("nophone"), "name": "T"}, timeout=15)
        assert r.status_code == 422, r.text

    def test_short_phone_422(self):
        r = requests.post(
            f"{API}/subscribe",
            json={"email": _email("short"), "name": "T", "phone": "1234"},
            timeout=15,
        )
        assert r.status_code == 422, r.text

    def test_empty_phone_422(self):
        r = requests.post(
            f"{API}/subscribe",
            json={"email": _email("empty"), "name": "T", "phone": ""},
            timeout=15,
        )
        assert r.status_code == 422, r.text


# ---------- Subscribe happy path (Meta error expected but endpoint still 200) ----------
class TestSubscribeFlow:
    def test_subscribe_valid_mx_phone_returns_200_and_persists(self, admin_token):
        email = _email("ok")
        payload = {"email": email, "name": "Testing WA", "phone": "5500000001"}
        r = requests.post(f"{API}/subscribe", json=payload, timeout=30)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["ok"] is True
        assert data["already_subscribed"] is False
        assert data["coupon"].startswith("MARILO-")
        # whatsapp_sent will be False due to Meta 132001 (expected)
        assert "whatsapp_sent" in data
        assert isinstance(data["whatsapp_sent"], bool)

        # Verify persistence via admin endpoint
        headers = {"Authorization": f"Bearer {admin_token}"}
        rl = requests.get(f"{API}/subscribers", headers=headers, timeout=15)
        assert rl.status_code == 200
        subs = rl.json()
        match = next((s for s in subs if s.get("email") == email), None)
        assert match is not None, "Subscriber not persisted"
        # Required fields on the document
        for field in ("phone", "phone_e164", "coupon", "whatsapp_sent", "whatsapp_message_id", "whatsapp_error"):
            assert field in match, f"missing field {field}"
        assert match["phone"] == "5500000001"
        assert match["phone_e164"] == "+525500000001"
        assert match["coupon"] == data["coupon"]
        # In current Meta config, whatsapp_sent should be False and error non-empty
        if match["whatsapp_sent"] is False:
            assert match["whatsapp_error"], "whatsapp_error should be populated on failure"
        else:
            assert match["whatsapp_message_id"], "message_id should be present on success"

    def test_idempotent_second_subscribe(self):
        email = _email("idem")
        p1 = {"email": email, "name": "Idem", "phone": "5500000002"}
        r1 = requests.post(f"{API}/subscribe", json=p1, timeout=30)
        assert r1.status_code == 200
        coupon1 = r1.json()["coupon"]

        # second time with same email -> already_subscribed
        r2 = requests.post(f"{API}/subscribe", json=p1, timeout=30)
        assert r2.status_code == 200
        d2 = r2.json()
        assert d2["ok"] is True
        assert d2["already_subscribed"] is True
        assert d2["coupon"] == coupon1

    def test_meta_error_does_not_break_endpoint(self):
        """Even though Meta returns 132001 (template in different WABA),
        endpoint must still return 200 with coupon."""
        email = _email("meta-err")
        r = requests.post(
            f"{API}/subscribe",
            json={"email": email, "name": "Meta Err", "phone": "5500000003"},
            timeout=30,
        )
        assert r.status_code == 200, r.text
        assert r.json()["coupon"].startswith("MARILO-")


# ---------- Admin subscribers list ----------
class TestAdminSubscribers:
    def test_requires_auth(self):
        r = requests.get(f"{API}/subscribers", timeout=15)
        assert r.status_code in (401, 403)

    def test_lists_with_phone_and_whatsapp_sent(self, admin_token):
        headers = {"Authorization": f"Bearer {admin_token}"}
        r = requests.get(f"{API}/subscribers", headers=headers, timeout=15)
        assert r.status_code == 200
        subs = r.json()
        assert isinstance(subs, list)
        # ensure our wa-test-* entries exist with correct shape
        wa_tests = [s for s in subs if s.get("email", "").startswith("wa-test-")]
        assert len(wa_tests) >= 1
        sample = wa_tests[0]
        assert "phone" in sample
        assert "whatsapp_sent" in sample
        # no mongo _id leakage
        assert "_id" not in sample


# ---------- Env wiring (sanity) ----------
class TestEnvWiring:
    def test_env_vars_present(self):
        # Can't read backend .env from here directly in all envs, so read file
        with open("/app/backend/.env") as f:
            content = f.read()
        assert "WHATSAPP_TOKEN=" in content and "WHATSAPP_TOKEN=\n" not in content
        assert "WHATSAPP_PHONE_ID=1428213377039718" in content
        assert "WHATSAPP_TEMPLATE=cupon_bienvenida_marilo" in content
        assert "WHATSAPP_TEMPLATE_LANGUAGE=es_MX" in content
        assert "WHATSAPP_GRAPH_VERSION=v21.0" in content
