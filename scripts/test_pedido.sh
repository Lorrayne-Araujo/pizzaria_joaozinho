#!/usr/bin/env bash
set -euo pipefail

# Script de teste para criar uma pizza e adicionar sabores
# Uso:
#   ./scripts/test_pedido.sh <borda_id> <massa_id> <sabor_id1> [sabor_id2] [sabor_id3]
# Exemplo:
#   ./scripts/test_pedido.sh 1 1 2 3

API="http://localhost:3000"

BORDAS_ID=${1:-1}
MASSAS_ID=${2:-1}
shift 2
SABORES=("$@")

if [ ${#SABORES[@]} -eq 0 ]; then
  echo "Nenhum sabor fornecido. Usando sabores de exemplo: 1 2 3"
  SABORES=(1 2 3)
fi

echo "API: $API"
echo "Borda ID: $BORDAS_ID, Massa ID: $MASSAS_ID, Sabores: ${SABORES[*]}"

echo "\n1) Criando pizza..."
resp=$(curl -s -w "\n%{http_code}" -X POST "$API/api/pizzas" \
  -H 'Content-Type: application/json' \
  -d "{\"bordas_id\":${BORDAS_ID},\"massas_id\":${MASSAS_ID}}")
http_code=$(echo "$resp" | tail -n1)
body=$(echo "$resp" | sed '$d')

if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
  pizza_id=$(echo "$body" | jq -r .pizza_id)
  if [ -z "$pizza_id" ] || [ "$pizza_id" = "null" ]; then
    echo "Resposta não contém pizza_id: $body"
    exit 1
  fi
  echo "Pizza criada com ID: $pizza_id"
else
  echo "Falha ao criar pizza (HTTP $http_code):"
  echo "$body"
  exit 1
fi

echo "\n2) Adicionando sabores à pizza $pizza_id..."
for s in "${SABORES[@]}"; do
  echo "- Adicionando sabor id=$s"
  resp=$(curl -s -w "\n%{http_code}" -X POST "$API/api/pizza_sabor" \
    -H 'Content-Type: application/json' \
    -d "{\"pizza_id\":${pizza_id},\"sabores_id\":${s}}")
  http_code=$(echo "$resp" | tail -n1)
  body=$(echo "$resp" | sed '$d')
  if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
    echo "  -> sabor $s adicionado com sucesso"
  else
    echo "  -> erro ao adicionar sabor $s (HTTP $http_code): $body"
  fi
done

echo "\n3) Adicionando pizza ao pedido..."
resp=$(curl -s -w "\n%{http_code}" -X POST "$API/api/pedidos" \
  -H 'Content-Type: application/json' \
  -d "{\"pizzas_id\":${pizza_id}}")
http_code=$(echo "$resp" | tail -n1)
body=$(echo "$resp" | sed '$d')
if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
  echo "Pizza $pizza_id adicionada ao pedido com sucesso."
else
  echo "Falha ao adicionar pizza ao pedido (HTTP $http_code):"
  echo "$body"
  exit 1
fi
done

echo "\nTeste concluído: pizza_id=$pizza_id, sabores=(${SABORES[*]})"

exit 0
