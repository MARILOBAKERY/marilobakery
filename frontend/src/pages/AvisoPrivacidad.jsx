import { useEffect } from "react";

const HTML = `<style>
.ap-wrap{font-family:-apple-system,system-ui,"Segoe UI",Roboto,sans-serif;background:#FFF8F0;color:#2d2d2d;line-height:1.8;margin:0;padding:24px;min-height:100vh}
.ap-wrap *{font-family:inherit}
.ap-container{max-width:800px;margin:0 auto;background:#fff;padding:48px;border-radius:24px;box-shadow:0 10px 40px rgba(0,0,0,0.06)}
.ap-container h1{font-size:34px;margin:0 0 8px;color:#3a2317}
.ap-container h2{font-size:18px;margin:32px 0 10px;color:#8B4513;border-bottom:1px solid #f3e8df;padding-bottom:6px}
.ap-container p,.ap-container li{font-size:15.5px}
.ap-container ul{padding-left:20px}
.ap-container small{color:#888}
.ap-header{margin-bottom:28px;border-bottom:2px solid #8B4513;padding-bottom:20px}
.ap-badge{display:inline-block;background:#FFF1E6;color:#8B4513;padding:6px 14px;border-radius:20px;font-size:12px;font-weight:800;letter-spacing:0.5px}
.ap-contact-box{background:#FFFBF7;border:1px solid #f3e8df;padding:16px 20px;border-radius:12px;margin:16px 0}
.ap-back{display:inline-block;margin-bottom:20px;color:#8B4513;text-decoration:none;font-weight:600;font-size:14px}
.ap-back:hover{text-decoration:underline}
@media(max-width:600px){.ap-container{padding:28px 20px}}
</style>
<div class="ap-wrap">
<div class="ap-container">
<a href="/" class="ap-back">← Volver a MARILÓ</a>
<div class="ap-header">
<div class="ap-badge">MARILO BAKERY &amp; COFFEE</div>
<h1>Aviso de Privacidad</h1>
<small>Última actualización: 8 de octubre de 2026 | Responsable: Lilia Amador Castellanos</small>
</div>
<div class="ap-contact-box">
<strong>Responsable del tratamiento:</strong> Lilia Amador Castellanos, operando como MARILO Bakery &amp; Coffee<br>
<strong>Domicilio:</strong> Alcaldía Tlalpan, Ciudad de México, CDMX, México<br>
<strong>Correo:</strong> marilo.bakery.coffee@gmail.com<br>
<strong>WhatsApp oficial:</strong> +52 56 1984 8299<br>
<strong>Sitio web:</strong> https://marilobakery.com
</div>
<h2>1. Qué datos recabamos</h2>
<p>Cuando te registras para recibir tu cupón de bienvenida de café gratis en https://marilobakery.com recabamos:</p>
<ul>
<li>Nombre completo</li>
<li>Número de teléfono / WhatsApp (ej: +52 5619848299)</li>
<li>Correo electrónico</li>
<li>Código de cupón generado, fecha de generación y estado de canje</li>
</ul>
<h2>2. Para qué usamos tus datos (finalidades)</h2>
<p><strong>Finalidades primarias (necesarias para el cupón):</strong></p>
<ul>
<li>Generar tu código único de cupón de bienvenida para café gratis</li>
<li>Enviarte tu cupón por WhatsApp mediante la plataforma oficial de WhatsApp Business de Meta (plantilla aprobada cupon_bienvenida_m)</li>
<li>Validar y canjear tu cupón en tienda</li>
</ul>
<p><strong>Finalidades secundarias (puedes oponerte):</strong></p>
<ul>
<li>Enviarte promociones, nuevos lanzamientos, sabores de temporada y beneficios exclusivos de MARILO</li>
<li>Mejorar nuestro servicio y atención</li>
</ul>
<p>Si no quieres finalidades secundarias, escríbenos a marilo.bakery.coffee@gmail.com con asunto "No promociones".</p>
<h2>3. Uso de WhatsApp Business</h2>
<p>Utilizamos la API oficial de <strong>WhatsApp Cloud API de Meta Platforms, Inc.</strong> Al proporcionarnos tu número de WhatsApp aceptas recibir un único mensaje de plantilla de bienvenida que contiene tu cupón. No te enviaremos spam. Puedes solicitar la baja en cualquier momento respondiendo con la palabra BAJA por WhatsApp o por correo a marilo.bakery.coffee@gmail.com.</p>
<h2>4. Con quién compartimos tus datos</h2>
<p>No vendemos ni alquilamos tus datos personales. Compartimos datos solo con:</p>
<ul>
<li><strong>Meta Platforms, Inc.</strong> (WhatsApp Business API) – únicamente para el envío del mensaje con tu cupón</li>
<li><strong>Netlify y Emergent</strong> – proveedores de hosting donde está alojada nuestra web</li>
</ul>
<p>No hacemos transferencias adicionales sin tu consentimiento, salvo las requeridas por ley.</p>
<h2>5. Tus derechos ARCO y revocación</h2>
<p>Tienes derecho a Acceder, Rectificar, Cancelar u Oponerte al uso de tus datos (derechos ARCO), así como revocar tu consentimiento.</p>
<p>Para ejercerlos envía un correo a <strong>marilo.bakery.coffee@gmail.com</strong> con:</p>
<ul>
<li>Asunto: "Derechos ARCO"</li>
<li>Tu nombre completo y medio para comunicarte la respuesta</li>
<li>Descripción clara del derecho que quieres ejercer</li>
</ul>
<p>Te responderemos en un máximo de 20 días hábiles y haremos efectiva tu solicitud en 15 días hábiles posteriores.</p>
<h2>6. Seguridad</h2>
<p>Protegemos tus datos con medidas administrativas, técnicas y físicas. Nuestro token de WhatsApp se almacena como variable de entorno encriptada en Netlify/Emergent y no es visible en el código de la página.</p>
<h2>7. Cookies</h2>
<p>Usamos cookies esenciales para que la página funcione y para contar cupones generados. No usamos cookies de publicidad invasiva.</p>
<h2>8. Cambios a este Aviso</h2>
<p>Cualquier cambio a este aviso se publicará en:</p>
<p><strong>https://marilobakery.com/aviso-de-privacidad</strong><br>
<strong>https://marilobakery.com/politica-de-privacidad</strong></p>
<p style="margin-top:36px"><strong>Al completar el formulario de MARILO aceptas este Aviso de Privacidad.</strong></p>
<p><small>MARILO Bakery &amp; Coffee – Café con propósito, hecho con amor en Tlalpan, CDMX ☕️</small></p>
</div>
</div>`;

export default function AvisoPrivacidad() {
  useEffect(() => { document.title = "Aviso de Privacidad - MARILÓ Bakery & Coffee"; }, []);
  return <div data-testid="aviso-privacidad-page" dangerouslySetInnerHTML={{ __html: HTML }} />;
}
