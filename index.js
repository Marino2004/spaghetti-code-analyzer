#!/usr/bin/env node

import { Command } from 'commander';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('spaghetti')
  .description('Un outil CLI pour vérifier un projet en Symfony')
  .version('1.0.0');

// Ajouter l'option de localisation directement au programme principal
program
  .requiredOption('-loc, --location <path>', 'chemin vers le dossier à vérifier')
  .action((options) => {
    const dirPath = options.location;

    // Vérifier si le répertoire existe
    if (!fs.existsSync(dirPath) || !fs.lstatSync(dirPath).isDirectory()) {
      console.error(`Le chemin spécifié n'est pas un répertoire valide: ${dirPath}`);
      process.exit(1);
    }

    // Compter le nombre de fichiers
    const files = fs.readdirSync(dirPath).filter(file => fs.lstatSync(path.join(dirPath, file)).isFile());
    const fileCount = files.length;

    // Compter le nombre total de lignes dans les fichiers
    let linesTotal = 0;
    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const fileLines = execSync(`wc -l < "${filePath}"`).toString().trim();
      linesTotal += parseInt(fileLines, 10);
    });

    // Calculer la moyenne des lignes de code
    const averageLines = fileCount > 0 ? (linesTotal / fileCount).toFixed(2) : 0;

    // Afficher les résultats
    console.log(`Nombre de fichiers = ${fileCount}`);
    console.log(`Ligne de code en moyenne = ${averageLines}`);
  });

program.parse(process.argv);
