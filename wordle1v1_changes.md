# Cambios en Wordle 1v1 - Nueva Jugabilidad

## Objetivo
Modificar el juego Wordle 1v1 para que la jugabilidad sea exactamente igual al Wordle normal, pero el primer jugador que complete todas las rondas sea el ganador.

## Cambios Realizados

### 1. Variables de Estado
- **Antes**: `player1Score`, `player2Score` (puntuación por rondas ganadas)
- **Después**: `player1CompletedRounds`, `player2CompletedRounds`, `player1Finished`, `player2Finished`

### 2. Lógica del Juego
- **Rondas ganadas**: Ahora se cuentan como "rondas completadas" sin importar si se adivinó o no la palabra
- **Victoria**: El primer jugador que complete todas las rondas establecidas gana
- **Empate**: Si ambos jugadores completan el mismo número de rondas

### 3. Interfaz de Usuario
- **Puntuación**: Ahora muestra progreso en formato "X/Total" (ej: "2/5")
- **Mensajes**: Actualizados para reflejar el nuevo objetivo (completar rondas en lugar de ganar puntos)

### 4. Flujo del Juego
1. Cada jugador juega independientemente su partida de Wordle
2. Al completar cada ronda (adivinando o no), se cuenta como completada
3. El juego termina cuando un jugador completa todas sus rondas
4. El ganador es quien complete sus rondas primero

### 5. Archivos Modificados
- `wordle1v1.js`: Lógica principal del juego
- `wordle1v1.html`: Interfaz de usuario
- `package.json`: Cambio a módulo ES para soporte de imports

## Comportamiento Esperado
- Misma mecánica de juego que Wordle normal
- Competencia basada en velocidad para completar rondas
- Sin sistema de puntuación tradicional
- Victoria basada en quien termina primero
