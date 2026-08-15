from flask import Flask, render_template

app = Flask(__name__)

# Datos de ejemplo
productos = [
    {'id': 1, 'nombre': 'Air Jordan 1 High "Chicago"', 'categoria': 'Sneakers', 'stock': 5, 'descripcion': 'Piel premium combinada en bloques blancos, rojos y negros clásicos.'},
    {'id': 2, 'nombre': 'Baggy Cargo Denim Desgastado', 'categoria': 'Streetwear', 'stock': 0, 'descripcion': 'Mezclilla pesada de corte ancho con bolsillos utilitarios laterales.'},
    {'id': 3, 'nombre': 'Cangurera Leather Cherry Red', 'categoria': 'Accesorios', 'stock': 14, 'descripcion': 'Herrajes pesados con correa ajustable y cuero texturizado.'},
]

clientes = [
    {'id': 1, 'nombre': 'Holger Martinez', 'email': 'holger@example.com', 'telefono': '0987654321'},
    {'id': 2, 'nombre': 'Corina Loaiza', 'email': 'corina@example.com', 'telefono': '0987654322'},
    {'id': 3, 'nombre': 'Celene Jimenez', 'email': 'celene@example.com', 'telefono': '0987654323'},
]

proveedores = [
    {'id': 1, 'nombre': 'Distribuidora Urbana S.A.', 'contacto': 'Brayan', 'telefono': '022345678'},
    {'id': 2, 'nombre': 'Calzado Premium Cía. Ltda.', 'contacto': 'Daniela', 'telefono': '022345679'},
    {'id': 3, 'nombre': 'Textiles Ecuador C.A.', 'contacto': 'Juan', 'telefono': '022345680'},
]

facturas = [
    {'id': 'FAC-001', 'cliente': 'Holger Martinez', 'fecha': '2026-08-10', 'total': 150.50},
    {'id': 'FAC-002', 'cliente': 'Corina Loaiza', 'fecha': '2026-08-11', 'total': 230.00},
    {'id': 'FAC-003', 'cliente': 'Celene Jimenez', 'fecha': '2026-08-12', 'total': 85.75},
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/productos')
def productos_view():
    return render_template('productos.html', productos=productos)

@app.route('/clientes')
def clientes_view():
    return render_template('clientes.html', clientes=clientes)

@app.route('/proveedores')
def proveedores_view():
    return render_template('proveedores.html', proveedores=proveedores)

@app.route('/facturacion')
def facturacion_view():
    return render_template('facturacion.html', facturas=facturas)

if __name__ == '__main__':
    app.run(debug=True)