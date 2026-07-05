#!/bin/bash
# Cria uma pasta the-agency-export com CLAUDE.md focado na formatação do Claude

OUTDIR="../../the-agency-claude-export"
echo "🛠️ Exportando perfis para formato do Claude..."

mkdir -p "$OUTDIR"

for profile in ../profiles/*/*.md; do
  if [ -f "$profile" ]; then
    filename=$(basename "$profile")
    cp "$profile" "$OUTDIR/$filename"
  fi
done

echo "Instruções: Para o Claude, referencie os arquivos da pasta the-agency-claude-export/ no seu prompt de sistema." > "$OUTDIR/README.txt"

echo "✅ Perfis exportados para $OUTDIR!"
