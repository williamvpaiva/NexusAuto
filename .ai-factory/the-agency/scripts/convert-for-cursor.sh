#!/bin/bash
# Gera o arquivo .cursorrules na raiz do projeto contendo as diretrizes de todos os perfis

OUTFILE="../../.cursorrules"
echo "🛠️ Gerando .cursorrules baseado nos perfis da The Agency..."

echo "# The Agency - Especialistas" > $OUTFILE
echo "Este projeto utiliza perfis especializados. Quando requisitado, assuma as personalidades abaixo." >> $OUTFILE
echo "" >> $OUTFILE

for profile in ../profiles/*/*.md; do
  if [ -f "$profile" ]; then
    echo "## Perfil Extraído: $(basename "$profile" .md)" >> $OUTFILE
    cat "$profile" >> $OUTFILE
    echo -e "\n---\n" >> $OUTFILE
  fi
done

echo "✅ .cursorrules gerado com sucesso!"
