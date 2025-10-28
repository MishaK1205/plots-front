#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

/**
 * Swagger to Individual TypeScript Interfaces Generator
 * Creates separate files for each interface from Swagger documentation
 */

const SWAGGER_URL = 'http://localhost:3000/swagger-json';
const OUTPUT_DIR = './src/app/api/interfaces';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function fetchSwaggerJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Failed to fetch Swagger JSON: ${error.message}`));
    });
  });
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

function toCamelCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .split(/[_\-\s]+/)
    .map((word, index) => 
      index === 0 
        ? word.toLowerCase() 
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

function toPascalCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .split(/[_\-\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function getTypeFromSchema(schema, name = '') {
  if (!schema) return 'any';
  
  // Handle $ref
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    return toPascalCase(refName);
  }
  
  // Handle allOf, oneOf, anyOf
  if (schema.allOf) {
    return schema.allOf.map(s => getTypeFromSchema(s)).join(' & ');
  }
  if (schema.oneOf) {
    return schema.oneOf.map(s => getTypeFromSchema(s)).join(' | ');
  }
  if (schema.anyOf) {
    return schema.anyOf.map(s => getTypeFromSchema(s)).join(' | ');
  }
  
  // Handle arrays
  if (schema.type === 'array') {
    const itemType = getTypeFromSchema(schema.items);
    return `${itemType}[]`;
  }
  
  // Handle objects
  if (schema.type === 'object' || schema.properties) {
    if (schema.properties) {
      const properties = Object.entries(schema.properties)
        .map(([key, prop]) => {
          const optional = schema.required?.includes(key) ? '' : '?';
          const propType = getTypeFromSchema(prop, key);
          const description = prop.description ? `\n  /** ${prop.description} */` : '';
          return `${description}\n  ${toCamelCase(key)}${optional}: ${propType};`;
        })
        .join('');
      
      return `{${properties}\n}`;
    }
    return 'Record<string, any>';
  }
  
  // Handle enums
  if (schema.enum) {
    return schema.enum.map(val => `'${val}'`).join(' | ');
  }
  
  // Handle primitive types
  switch (schema.type) {
    case 'string':
      if (schema.format === 'date' || schema.format === 'date-time') {
        return 'string'; // Could be Date if you prefer
      }
      return 'string';
    case 'number':
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'null':
      return 'null';
    default:
      return 'any';
  }
}

function generateInterfaceFile(schemaName, schema) {
  // Clean up interface names - remove Dto suffix and convert to PascalCase
  let cleanName = schemaName;
  if (cleanName.endsWith('Dto')) {
    cleanName = cleanName.slice(0, -3); // Remove 'Dto' suffix
  }
  
  const interfaceName = toPascalCase(cleanName);
  const fileName = `${toKebabCase(cleanName)}.interface.ts`;
  const description = schema.description || `${interfaceName} interface`;
  
  const typeDefinition = getTypeFromSchema(schema, schemaName);
  
  const fileContent = `/**
 * ${description}
 * Generated from Swagger documentation
 */

export interface ${interfaceName} ${typeDefinition}
`;

  return {
    fileName,
    content: fileContent,
    interfaceName
  };
}

function generateIndexFile(interfaces) {
  const exports = interfaces.map(({ fileName, interfaceName }) => {
    const importPath = `./${fileName.replace('.ts', '')}`;
    return `export type { ${interfaceName} } from '${importPath}';`;
  }).join('\n');

  return `/**
 * Auto-generated exports for all interfaces
 * Generated from Swagger documentation
 */

${exports}
`;
}

async function main() {
  try {
    log('🚀 Starting Individual Interface Generator...', 'cyan');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      log(`📁 Created output directory: ${OUTPUT_DIR}`, 'green');
    }
    
    // Fetch Swagger JSON
    log(`📡 Fetching Swagger JSON from ${SWAGGER_URL}...`, 'yellow');
    const swagger = await fetchSwaggerJson(SWAGGER_URL);
    log('✅ Successfully fetched Swagger JSON', 'green');
    
    // Generate individual interface files
    log('🔧 Generating individual interface files...', 'yellow');
    const schemas = swagger.components?.schemas || {};
    const interfaces = [];
    
    Object.entries(schemas).forEach(([schemaName, schema]) => {
      const interfaceFile = generateInterfaceFile(schemaName, schema);
      interfaces.push(interfaceFile);
      
      // Write individual interface file
      const filePath = path.join(OUTPUT_DIR, interfaceFile.fileName);
      fs.writeFileSync(filePath, interfaceFile.content, 'utf8');
      
      log(`📄 Created: ${interfaceFile.fileName}`, 'blue');
    });
    
    // Generate index file
    const indexContent = generateIndexFile(interfaces);
    const indexPath = path.join(OUTPUT_DIR, 'index.ts');
    fs.writeFileSync(indexPath, indexContent, 'utf8');
    
    log(`📄 Created: index.ts`, 'blue');
    
    log(`✅ Successfully generated ${interfaces.length} interface files!`, 'green');
    log(`📁 Output directory: ${OUTPUT_DIR}`, 'blue');
    
    // Show usage instructions
    log('\n📖 Usage Instructions:', 'cyan');
    log('1. Import specific interface:', 'yellow');
    log('   import { CreateCompany } from "./api/interfaces/create-company.interface";', 'magenta');
    log('2. Import from index:', 'yellow');
    log('   import { CreateCompany, Company } from "./api/interfaces";', 'magenta');
    log('3. Re-run this script when your API changes', 'yellow');
    
    // Show generated files
    log('\n📋 Generated Files:', 'cyan');
    interfaces.forEach(({ fileName, interfaceName }) => {
      log(`   ${fileName} → ${interfaceName}`, 'magenta');
    });
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fetchSwaggerJson,
  generateInterfaceFile,
  generateIndexFile
};
