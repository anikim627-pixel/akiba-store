<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");

try {
    require_once __DIR__ . "/conexion.php";
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "message" => "No se pudo conectar con la base de datos: " . $error->getMessage(),
    ]);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "message" => "Método no permitido. Usa POST.",
    ]);
    exit;
}

$cliente = trim($_POST["cliente"] ?? "");
$correo = trim($_POST["correo"] ?? "");
$telefono = trim($_POST["telefono"] ?? "");
$ciudad = trim($_POST["ciudad"] ?? "");
$producto = trim($_POST["producto"] ?? "");
$cantidad = (int) ($_POST["cantidad"] ?? 0);
$precioUnitario = (float) ($_POST["precio_unitario"] ?? 0);
$total = (float) ($_POST["total"] ?? 0);
$direccion = trim($_POST["direccion"] ?? "");

if (
    $cliente === "" ||
    $correo === "" ||
    $telefono === "" ||
    $ciudad === "" ||
    $producto === "" ||
    $cantidad < 1 ||
    $precioUnitario <= 0 ||
    $total <= 0 ||
    $direccion === ""
) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "Completa todos los datos del registro y agrega productos validos.",
    ]);
    exit;
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode([
        "ok" => false,
        "message" => "El correo electrónico no es válido.",
    ]);
    exit;
}

try {
    $sql = "INSERT INTO pedidos
            (cliente, correo, telefono, ciudad, producto, cantidad, precio_unitario, total, direccion)
            VALUES
            (:cliente, :correo, :telefono, :ciudad, :producto, :cantidad, :precio_unitario, :total, :direccion)";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ":cliente" => $cliente,
        ":correo" => $correo,
        ":telefono" => $telefono,
        ":ciudad" => $ciudad,
        ":producto" => $producto,
        ":cantidad" => $cantidad,
        ":precio_unitario" => $precioUnitario,
        ":total" => $total,
        ":direccion" => $direccion,
    ]);

    echo json_encode([
        "ok" => true,
        "message" => "Pedido guardado correctamente.",
        "id" => $pdo->lastInsertId(),
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "message" => "No se pudo guardar el pedido. Revisa que MySQL este encendido y que la tabla pedidos tenga los campos nuevos. Detalle: " . $error->getMessage(),
    ]);
}
