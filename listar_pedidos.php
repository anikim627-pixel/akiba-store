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

if ($_SERVER["REQUEST_METHOD"] !== "GET") {
    http_response_code(405);
    echo json_encode([
        "ok" => false,
        "message" => "Método no permitido. Usa GET.",
    ]);
    exit;
}

$limite = (int) ($_GET["limite"] ?? 10);
$limite = max(1, min($limite, 50));

try {
    $stmt = $pdo->prepare(
        "SELECT id, cliente, correo, telefono, ciudad, producto, cantidad, precio_unitario, total, direccion, fecha_creacion
         FROM pedidos
         ORDER BY fecha_creacion DESC
         LIMIT :limite"
    );
    $stmt->bindValue(":limite", $limite, PDO::PARAM_INT);
    $stmt->execute();

    echo json_encode([
        "ok" => true,
        "data" => $stmt->fetchAll(),
    ]);
} catch (Throwable $error) {
    http_response_code(500);
    echo json_encode([
        "ok" => false,
        "message" => "No se pudieron cargar los pedidos. Revisa que exista la tabla pedidos. Detalle: " . $error->getMessage(),
    ]);
}
