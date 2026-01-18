#!/bin/bash
# Script de test pour vérifier la clé API Prelude
# Usage: ./test-prelude-api.sh VOTRE_CLE_API

API_KEY="${1:-key_01kf9kn2e3e7q89cxmcry0xfvf}"
PHONE="+33767602972"

echo "════════════════════════════════════════"
echo "🧪 Test de la clé API Prelude"
echo "════════════════════════════════════════"
echo ""
echo "Clé API (début): ${API_KEY:0:20}..."
echo "Longueur: ${#API_KEY} caractères"
echo "Numéro de test: $PHONE"
echo ""
echo "Test 1: Endpoint /v2/verification"
echo "─────────────────────────────────────"
curl -X POST "https://api.prelude.dev/v2/verification" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"target\":{\"type\":\"phone_number\",\"value\":\"$PHONE\"}}" \
  -w "\n\nStatus HTTP: %{http_code}\n" \
  -s | jq '.' || echo "Erreur lors de l'appel"
echo ""
echo "════════════════════════════════════════"
echo "Si vous obtenez 403 invalid_api_key:"
echo "1. Vérifiez que la clé est complète (30+ caractères)"
echo "2. Vérifiez que la clé est active dans le dashboard"
echo "3. Vérifiez les permissions de la clé"
echo "════════════════════════════════════════"
