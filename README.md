# Akiba Store

Página web ejecutable para vender productos de anime y cultura japonesa.

Incluye:

- `index.html`: estructura de la página.
- `styles.css`: diseño visual.
- `app.js`: JavaScript con peticiones `POST` y `GET`.
- `conexion.php`: conexión a MySQL.
- `guardar_pedido.php`: endpoint `POST` para guardar pedidos.
- `listar_pedidos.php`: endpoint `GET` para consultar pedidos.
- `database.sql`: creación de base de datos y tabla.

## Cómo ejecutarlo con Visual Studio Code, PHP y MySQL

1. Instala XAMPP desde `https://www.apachefriends.org/`.
2. Abre XAMPP Control Panel.
3. Inicia `Apache` y `MySQL`.
4. Copia esta carpeta del proyecto dentro de:

   ```txt
   C:\xampp\htdocs\akiba-store
   ```

5. Abre Visual Studio Code.
6. En VS Code abre la carpeta:

   ```txt
   C:\xampp\htdocs\akiba-store
   ```

7. Entra a phpMyAdmin desde el navegador:

   ```txt
   http://localhost/phpmyadmin
   ```

8. Crea la base de datos importando el archivo `database.sql`:

   - Clic en `Importar`.
   - Selecciona `database.sql`.
   - Clic en `Continuar`.

9. Abre la página en el navegador:

   ```txt
   http://localhost/akiba-store/index.html
   ```

## Cómo se vincula el código con la base de datos

La conexión está en `conexion.php`:

```php
$host = "localhost";
$database = "akiba_store";
$user = "root";
$password = "";
```

En XAMPP normalmente el usuario es `root` y la contraseña va vacía.
Si tu MySQL tiene otra contraseña, cambia `$password`.

## Cómo funcionan POST y GET

El formulario de `index.html` se envía con JavaScript usando `POST`:

```js
fetch("guardar_pedido.php", {
  method: "POST",
  body: formData
});
```

Ese endpoint guarda el pedido en la tabla `pedidos`.

Para listar pedidos se usa `GET`:

```js
fetch("listar_pedidos.php?limite=10", {
  method: "GET"
});
```

Ese endpoint consulta MySQL y devuelve los pedidos en formato JSON.
