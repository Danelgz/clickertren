# Wordle 1v1 - Juego Multijugador en Tiempo Real

## Descripción
Wordle 1v1 es una versión multijugador del juego Wordle donde dos jugadores pueden competir en tiempo real a través de salas privadas.

## Características

### 🏠 Sistema de Salas
- **Crear Sala**: El creador elige el número de rondas (1, 3, 5, 10 o 20)
- **Código de Sala**: Se genera un código único de 6 caracteres
- **Unirse a Sala**: Los jugadores introducen el código para unirse

### ⚔️ Juego 1v1
- **Mismas Palabras**: Ambos jugadores reciben las mismas palabras (en orden diferente para evitar copia)
- **Rondas Competitivas**: Cada ronda ganada suma 1 punto
- **Tiempo Real**: Los movimientos del oponente se ven en tiempo real
- **Tableros Doble**: Tu tablero y el del oponente visibles simultáneamente

### 🏆 Sistema de Puntuación
- **Puntos por Ronda**: 1 punto por cada palabra adivinada correctamente
- **Ganador**: El jugador con más puntos al final de todas las rondas
- **Ranking**: Los ganadores se guardan en el ranking global

## Cómo Jugar

### 1. Crear una Sala
1. Haz clic en "🎮 Crear Sala"
2. Selecciona el número de rondas
3. Copia el código generado de 6 caracteres
4. Comparte el código con tu oponente

### 2. Unirse a una Sala
1. Introduce el código de 6 caracteres
2. Haz clic en "➡️ Unirse a Sala"
3. Espera a que el creador inicie el juego

### 3. Durante el Juego
- **Tu Tablero (izquierda)**: Escribe tus intentos aquí
- **Tablero Oponente (derecha)**: Ve los intentos de tu oponente
- **Teclado Virtual**: Usa el teclado en pantalla o el físico
- **Colores**: 
  - 🟩 Verde: Letra correcta en posición correcta
  - 🟨 Amarillo: Letra correcta en posición incorrecta
  - ⬜ Gris: Letra no está en la palabra

### 4. Fin del Juego
- El jugador con más puntos gana
- Los resultados se guardan en el ranking
- Puedes jugar de nuevo inmediatamente

## Aspectos Técnicos

### 🗄️ Base de Datos
- **Firebase Firestore**: Para almacenamiento en tiempo real
- **Colecciones**:
  - `wordle1v1_rooms`: Salas activas
  - `ranking_wordle1v1`: Ranking de jugadores

### 🔐 Seguridad
- **Autenticación Requerida**: Solo usuarios registrados pueden jugar
- **Reglas Firestore**: Control de acceso a las salas
- **Códigos Únicos**: Sistema de generación de códigos seguros

### 📱 Responsive Design
- **Desktop**: Experiencia completa con video de fondo
- **Móvil**: Interfaz optimizada con fondo animado
- **Tablet**: Diseño adaptable

## Archivos del Proyecto

### Frontend
- `wordle1v1.html`: Estructura HTML del juego
- `wordle1v1.css`: Estilos y diseño responsive
- `wordle1v1.js`: Lógica del juego y multiplayer

### Configuración
- `firestore.rules`: Reglas de seguridad de Firebase
- `firebase-config.js`: Configuración de Firebase

## Instalación y Despliegue

1. **Configurar Firebase**
   ```bash
   # Actualizar reglas en Firestore
   firebase deploy --only firestore:rules
   ```

2. **Archivos Estáticos**
   - Los archivos ya están configurados para el despliegue
   - No se requiere instalación adicional

3. **Probar Localmente**
   ```bash
   # Iniciar servidor local
   python -m http.server 8000
   # Acceder a http://localhost:8000/wordle1v1.html
   ```

## Flujo del Juego

### 1. Inicio
```
Usuario → Login → Pantalla de Salas
```

### 2. Creación de Sala
```
Creador → Elige rondas → Genera código → Espera oponente
```

### 3. Unión a Sala
```
Oponente → Introduce código → Se une → Inicia juego
```

### 4. Juego Activo
```
Ambos → Juegan misma palabra → Ven progreso → Siguiente ronda
```

### 5. Fin del Juego
```
Última ronda → Calcula ganador → Muestra resultados → Actualiza ranking
```

## Características Especiales

### 🔄 Sincronización en Tiempo Real
- Actualizaciones instantáneas del oponente
- Sincronización de estado de juego
- Detección de desconexiones

### 🎯 Sistema Anti-Trampa
- Palabras en orden diferente para cada jugador
- Validación de palabras en servidor
- Control de intentos por ronda

### 📊 Estadísticas
- Puntos acumulados
- Victorias totales
- Ranking global

## Problemas Conocidos y Soluciones

### Conexión
- **Problema**: "No se puede unir a la sala"
- **Solución**: Verificar conexión a internet y código correcto

### Sincronización
- **Problema**: "No veo los movimientos del oponente"
- **Solución**: Recargar la página, el juego se restaura automáticamente

### Rendimiento
- **Problema**: "Juego lento en móvil"
- **Solución**: Cerrar otras pestañas, usar conexión estable

## Futuras Mejoras

- [ ] Salas espectador
- [ ] Modo torneo
- [ ] Chat en juego
- [ ] Temas personalizables
- [ ] Estadísticas detalladas
- [ ] Sistema de emparejamiento automático

## Soporte

Para problemas o sugerencias, contacta al desarrollador.

---

**Diviértete jugando Wordle 1v1! 🎮⚔️**
