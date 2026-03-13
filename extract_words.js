const fs = require('fs');

// Leer el archivo spanish.txt
const content = fs.readFileSync('spanish.txt', 'utf8');
const lines = content.split('\n');

console.log('Total de líneas:', lines.length);

// Filtrar palabras de exactamente 5 letras
const fiveLetterWords = lines
    .map(line => line.trim())
    .filter(word => word.length === 5) // Exactamente 5 caracteres
    .filter(word => !word.includes('á') && !word.includes('é') && !word.includes('í') && !word.includes('ó') && !word.includes('ú')) // Sin tildes
    .filter(word => /^[a-zA-ZñÑ]+$/.test(word)) // Solo letras y ñ
    .map(word => word.toUpperCase())
    .filter((word, index, self) => self.indexOf(word) === index); // Eliminar duplicados

console.log(`Encontradas ${fiveLetterWords.length} palabras de 5 letras`);

// Guardar en un archivo
const output = fiveLetterWords.join('","');
fs.writeFileSync('five_letter_words.txt', `["${output}"]`);

console.log('Palabras guardadas en five_letter_words.txt');
console.log('Primeras 20 palabras:');
console.log(fiveLetterWords.slice(0, 20));
