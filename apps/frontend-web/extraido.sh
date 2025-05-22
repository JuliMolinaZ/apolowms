#!/bin/bash
# Script para extraer componentes de Frontend-Web (archivos .tsx)
# Se excluyen archivos que contengan "module", "config", "layout" o "test" en su nombre,
# además de filtrar líneas que contengan referencias a imágenes o emails.

OUTPUT="codigo_componentes_frontend_web.txt"
[ -f "$OUTPUT" ] && rm "$OUTPUT"

echo "===== Extrayendo componentes de Frontend-Web (excluyendo módulos, configuraciones, layouts y tests) =====" >> "$OUTPUT"

# Directorios a procesar según tu estructura
DIRS=("src/app" "src/components")

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        echo "Procesando directorio: $dir"
        find "$dir" -type f -iname "*.tsx" \
          ! -path "*/node_modules/*" \
          ! -iname "*module*.tsx" \
          ! -iname "*config*.tsx" \
          ! -iname "*layout*.tsx" \
          ! -iname "*test*.tsx" \
          -print0 | while IFS= read -r -d '' file; do
            echo "===== Archivo: $file =====" >> "$OUTPUT"
            # Filtra líneas que contengan extensiones de imágenes o emails
            cat "$file" | grep -Ev '(\.png|\.svg|\.jpeg|\.jpg|@gmail|@hotmail)' >> "$OUTPUT"
            echo -e "\n\n" >> "$OUTPUT"
        done
    else
        echo "El directorio $dir no existe."
    fi
done

echo "Extracción completada. Archivo generado: $OUTPUT"
