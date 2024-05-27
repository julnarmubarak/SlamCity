import os
import json

# List of controller names to be used in the third line
with open('tables.json', 'r') as file:
    data = json.load(file)


controllers = []
for table_name, table_info in data['tables'].items():
    controllers.append(table_name )

# Base content of the file, with a placeholder for the controller name
base_content = '''const express = require('express');
const router = express.Router();
const Controller = require('../controllers/{controller}');

router.get('/', Controller.getAll);
router.post('/', Controller.create);
router.get('/:id', Controller.getOne);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.delete);

module.exports = router;
'''

# Directory to store the created files
directory = 'generated_files'
os.makedirs(directory, exist_ok=True)

# Generate each file
for controller in controllers:
    filename = f'{controller.split("Controller")[0].lower()}_routes.js'
    file_path = os.path.join(directory, filename)
    with open(file_path, 'w') as file:
        file_content = base_content.format(controller=controller)
        file.write(file_content)
    print(f'File {filename} created successfully.')

print('All files have been created.')