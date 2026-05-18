"""MARILÓ Café backend API tests"""
import os
import base64
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://cafe-gallery-store.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@marilo.cafe"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


# -------- Public --------
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200

def test_menu_seeded(session):
    r = session.get(f"{API}/menu")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 9, f"expected at least 9 menu items, got {len(data)}"
    assert "name" in data[0] and "price" in data[0]

def test_products_seeded(session):
    r = session.get(f"{API}/products")
    assert r.status_code == 200
    assert len(r.json()) >= 4

def test_gallery_seeded(session):
    r = session.get(f"{API}/gallery")
    assert r.status_code == 200
    assert len(r.json()) >= 6

def test_settings_default(session):
    r = session.get(f"{API}/settings")
    assert r.status_code == 200
    d = r.json()
    assert "address" in d and "instagram_url" in d


# -------- Auth --------
def test_login_success(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    d = r.json()
    assert "access_token" in d and d["token_type"] == "bearer"
    assert d["user"]["email"] == ADMIN_EMAIL
    assert d["user"]["role"] == "admin"

def test_login_wrong_password(session):
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401

def test_me_requires_token(session):
    r = session.get(f"{API}/auth/me")
    assert r.status_code == 401

def test_me_with_token(session, auth_headers):
    r = session.get(f"{API}/auth/me", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["email"] == ADMIN_EMAIL


# -------- Menu CRUD --------
def test_create_menu_requires_auth(session):
    r = session.post(f"{API}/menu", json={"name": "X", "price": "$1", "category": "Cafés"})
    assert r.status_code == 401

def test_menu_full_crud(session, auth_headers):
    payload = {"name": "TEST_Item", "description": "desc", "price": "$10", "category": "Cafés", "order": 99}
    r = session.post(f"{API}/menu", headers=auth_headers, json=payload)
    assert r.status_code == 200
    item = r.json()
    item_id = item["id"]
    assert item["name"] == "TEST_Item"

    # verify GET
    r = session.get(f"{API}/menu")
    assert any(i["id"] == item_id for i in r.json())

    # PUT
    upd = {**payload, "name": "TEST_Updated", "price": "$11"}
    r = session.put(f"{API}/menu/{item_id}", headers=auth_headers, json=upd)
    assert r.status_code == 200
    assert r.json()["name"] == "TEST_Updated"

    # DELETE
    r = session.delete(f"{API}/menu/{item_id}", headers=auth_headers)
    assert r.status_code == 200
    r = session.get(f"{API}/menu")
    assert not any(i["id"] == item_id for i in r.json())


# -------- Products CRUD --------
def test_products_full_crud(session, auth_headers):
    payload = {"name": "TEST_Prod", "price": "$50", "description": "d", "image_url": "", "available": True, "order": 99}
    r = session.post(f"{API}/products", headers=auth_headers, json=payload)
    assert r.status_code == 200
    pid = r.json()["id"]

    r = session.put(f"{API}/products/{pid}", headers=auth_headers, json={**payload, "name": "TEST_Prod2"})
    assert r.status_code == 200
    assert r.json()["name"] == "TEST_Prod2"

    r = session.delete(f"{API}/products/{pid}", headers=auth_headers)
    assert r.status_code == 200


# -------- Gallery --------
def test_gallery_create_delete(session, auth_headers):
    r = session.post(f"{API}/gallery", headers=auth_headers, json={"image_url": "https://example.com/x.jpg", "caption": "TEST_cap", "order": 99})
    assert r.status_code == 200
    gid = r.json()["id"]
    r = session.delete(f"{API}/gallery/{gid}", headers=auth_headers)
    assert r.status_code == 200


# -------- Recipes --------
def test_recipes_lifecycle(session, auth_headers):
    pdf_bytes = b"%PDF-1.4\n%TEST\n"
    pdf_data = "data:application/pdf;base64," + base64.b64encode(pdf_bytes).decode()
    r = session.post(f"{API}/recipes", headers=auth_headers, json={"title": "TEST_Recipe", "description": "d", "pdf_data": pdf_data})
    assert r.status_code == 200
    rid = r.json()["id"]

    # list should NOT contain pdf_data
    r = session.get(f"{API}/recipes")
    assert r.status_code == 200
    found = [x for x in r.json() if x["id"] == rid]
    assert found and "pdf_data" not in found[0], "list endpoint should exclude pdf_data"

    # detail SHOULD contain pdf_data
    r = session.get(f"{API}/recipes/{rid}")
    assert r.status_code == 200
    assert r.json()["pdf_data"].startswith("data:application/pdf")

    r = session.delete(f"{API}/recipes/{rid}", headers=auth_headers)
    assert r.status_code == 200
    r = session.get(f"{API}/recipes/{rid}")
    assert r.status_code == 404


# -------- Settings update --------
def test_settings_update(session, auth_headers):
    cur = session.get(f"{API}/settings").json()
    new_addr = "TEST_Address 99"
    payload = {**cur, "address": new_addr}
    r = session.put(f"{API}/settings", headers=auth_headers, json=payload)
    assert r.status_code == 200
    assert r.json()["address"] == new_addr

    # persist
    r = session.get(f"{API}/settings")
    assert r.json()["address"] == new_addr

    # revert
    session.put(f"{API}/settings", headers=auth_headers, json=cur)
