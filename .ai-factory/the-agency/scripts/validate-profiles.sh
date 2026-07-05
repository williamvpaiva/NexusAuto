#!/bin/bash
# Validate profiles for required frontmatter fields

echo "🔍 Validando perfis da agência..."
ERRORS=0

# Check if profiles directory exists
if [ ! -d "../profiles" ]; then
  echo "❌ Diretório ../profiles não encontrado."
  exit 1
fi

# Iterate over all .md files in profiles subdirectories
for profile in ../profiles/*/*.md; do
  if [ -f "$profile" ]; then
    if ! grep -q "^name:" "$profile"; then echo "❌ Falta 'name' em $profile"; ERRORS=1; fi
    if ! grep -q "^division:" "$profile"; then echo "❌ Falta 'division' em $profile"; ERRORS=1; fi
    if ! grep -q "^role:" "$profile"; then echo "❌ Falta 'role' em $profile"; ERRORS=1; fi
  fi
done

if [ $ERRORS -ne 0 ]; then
  echo "⚠️ Foram encontrados erros na validação!"
  exit 1
else
  echo "✅ Todos os perfis estão válidos!"
  exit 0
fi
