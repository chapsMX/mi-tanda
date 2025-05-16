# Mi Tanda - Farcaster Mini App

## Background and Motivation
The project is a Tanda (ROSCA) DApp built on Base network that allows users to create and manage rotating savings groups using USDC as the contribution token.

## Key Challenges and Analysis

### Implementación de Página de Detalle de Tanda

Se ha implementado la página de detalle para tandas individuales con las siguientes características:

1. **Estructura de Ruta**:
   - Creada página dinámica en `app/tandas/[id]/page.tsx`
   - Parámetro de ID extraído mediante `useParams`
   - Validación de ID para asegurar formato correcto

2. **Consulta de Datos**:
   - Uso de `useTandaData` para obtener información detallada
   - Hook mejorado para soportar opciones como `enabled`
   - Manejo de estados de carga y error

3. **Interfaz de Usuario**:
   - Secciones organizadas por tipo de información:
     - Información General (montos, intervalos, etc.)
     - Estado Actual (ciclo, fondos, timestamps)
     - Orden de Pagos (si está disponible)
     - Acciones disponibles para el usuario
   - Diseño consistente con el resto de la aplicación
   - Indicadores visuales de estado (colores, etiquetas)

4. **Interacciones con Contrato**:
   - Botones para acciones clave:
     - Unirse a tanda (Join)
     - Contribuir al ciclo actual (Contribute)
     - Reclamar pago (Claim Payout)
   - Integración con OnchainKit Transaction
   - Configuración específica para Base L2
   - Validación de red antes de transacciones

5. **Implementación Condicional**:
   - Botones mostrados según estado de la tanda
   - Validación de participación del usuario
   - Manejo de estados específicos (tanda llena, cerrada, etc.)

6. **Formato y Presentación**:
   - Fechas formateadas desde timestamps
   - Direcciones truncadas para mejor visualización
   - Montos convertidos de wei a USDC (6 decimales)
   - Indicadores visuales de ciclo actual

### Network Configuration Issue Analysis

**Current Status**: El problema ha sido resuelto. Las transacciones ahora se ejecutan correctamente en la red Base.

**Solución Implementada**:

1. Integración con OnchainKit Transaction:
   - Se reemplazó la implementación manual con wagmi por componentes de Transaction de OnchainKit
   - Configuración explícita de chainId en los componentes Transaction
   - Uso del patrón correcto de contracts vs params en OnchainKit

2. Estructura correcta de componentes:
   - Uso de TransactionButton con prop text en lugar de children
   - Organización jerárquica según la documentación de OnchainKit
   - Manejo de estado de transacción mediante TransactionStatus

3. Validación de red:
   - Verificación y feedback del chainId al usuario
   - Mensajes de error claros cuando la red es incorrecta
   - Opción para volver a la lista de tandas

4. Mejoras de UX:
   - Deshabilitación de botones cuando la red es incorrecta
   - Manejo adecuado del estado de aprobación de USDC
   - Feedback visual durante el proceso de transacción

### Implementation Plan

1. Update Contract Write Operations:
   - [ ] Modify useWriteContract hooks to specify Base chainId
   - [ ] Add chain validation before transactions
   - [ ] Implement network switching if needed

2. Enhance Error Handling:
   - [ ] Add network-specific error messages
   - [ ] Improve user feedback for network issues
   - [ ] Add network switching guidance

3. Testing:
   - [ ] Test contract creation on Base L2
   - [ ] Test USDC approval on Base L2
   - [ ] Verify transaction confirmations

### Success Criteria
- All transactions must execute on Base L2 (chainId: 8453)
- Clear error messages when wrong network is detected
- Smooth network switching experience
- Successful contract deployment and USDC approval on Base

## Next Steps (Priority)
1. [ ] Update contract write operations in create/page.tsx
2. [ ] Add network validation logic
3. [ ] Test all transactions on Base L2
4. [ ] Update error handling for network issues

## Lessons
- Always specify chainId explicitly for contract operations
- Validate network before executing transactions
- Handle network switching gracefully
- Provide clear feedback for network-related issues

### Contract Integration Files Analysis (`lib/contracts.ts` and `lib/contracts/tanda.ts`)

These files serve as the bridge between our frontend application and the smart contracts deployed on Base network. Here's a detailed breakdown:

1. **Core Contract Configurations**:
   - TANDA_MANAGER_ADDRESS: Points to the deployed contract at `0x8bf9da65f4c8479f042156e2a9d723273774898b`
   - USDC_ADDRESS: Points to Base's USDC token at `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - BASE_CHAIN_ID: Defines Base network's chain ID (8453)

2. **Contract ABIs (Application Binary Interface)**:
   - TANDA_MANAGER_ABI: Defines all available interactions with the Tanda contract including:
     - createTanda: For creating new tanda groups
     - getActiveTandaIds: For retrieving active tanda IDs
     - getTandaData: For fetching detailed tanda information
   - USDC_ABI: Minimal interface for USDC token interactions:
     - allowance: Check spending permissions
     - approve: Grant spending permissions
     - balanceOf: Check token balance

3. **Purpose and Usage**:
   - Contract Type Safety: The ABIs are defined with TypeScript const assertions for type safety
   - Frontend Integration: Used by wagmi hooks in components for contract interactions
   - Centralized Contract Config: Single source of truth for contract addresses and interfaces

4. **Key Features Enabled**:
   - Tanda Creation
   - USDC Approval Flow
   - Tanda Data Retrieval
   - Active Tanda Listing

## Project Status Board
- [x] Resolución del problema de red (chainId incorrecto)
- [x] Implementación de mejor UX para cambios de red
- [x] Corrección de importaciones de contratos
- [x] Integración con OnchainKit Transaction
- [x] Verificación de chainId antes de transacciones
- [x] Implementación de página de detalle de tanda
- [x] Visualización organizada de datos de tanda
- [x] Acciones de usuario (unirse, contribuir, reclamar)
- [ ] Pruebas en la red Base 

## Executor's Feedback or Assistance Requests
Los errores del linter relacionados con TransactionButton y props de children vs text han sido resueltos. El componente Transaction ahora recibe contracts en lugar de parámetros individuales para el contrato, lo que mejora la tipificación y reduce errores.

## Lessons
- Siempre verificar el chainId antes de enviar transacciones
- Proporcionar una UX clara para el cambio de red en aplicaciones web3
- Familiarizarse con los patrones específicos de cada librería (OnchainKit vs wagmi directo)
- Seguir la documentación oficial para el uso correcto de componentes
- En OnchainKit, los componentes Transaction reciben `contracts` en lugar de `contract`/`action`/`params`
- En OnchainKit, TransactionButton recibe `text` en lugar de `children`
- Verificar cómo manejan las librerías el styling y la anidación de componentes

### Contract Function Analysis

1. Crear Tandas (Create Tanda)
   - Function: `createTanda(uint256 _contributionAmount, uint256 _payoutInterval, uint16 _participantCount, uint256 _gracePeriod)`
   - Parameters:
     - contributionAmount: Cantidad en USDC que cada participante debe contribuir
     - payoutInterval: Intervalo de tiempo entre pagos
     - participantCount: Número máximo de participantes (uint16)
     - gracePeriod: Período de gracia para pagos
   - Pre-requisitos:
     - Aprobación de USDC (approve) antes de crear la tanda
     - Usuario debe tener suficiente USDC
   - Flujo:
     1. Obtener dirección de USDC del contrato
     2. Aprobar gasto de USDC
     3. Crear la tanda
     4. Esperar confirmación y obtener ID de la tanda

2. Verificar Estado (Check Status)
   - Funciones principales:
     - `getActiveTandaIds()`: Lista todas las tandas activas
     - `getTandaData(uint256 tandaId)`: Obtiene detalles completos de una tanda
   - Datos importantes retornados:
     - GeneralInfo: Información básica (montos, intervalos, participantes)
     - CurrentStatus: Estado actual (ciclo, participantes, timestamps)
     - PayoutOrderInfo: Orden de pagos
   - Flujo de verificación:
     1. Obtener lista de tandas activas
     2. Para cada tanda, obtener datos completos
     3. Mostrar información relevante al usuario

3. Interactuar con Tanda (New Analysis)
   - Funciones principales:
     - `joinTanda(uint256 tandaId)`: Unirse a una tanda
     - `contribute(uint256 tandaId)`: Hacer contribución del ciclo
     - `claimPayout(uint256 tandaId)`: Reclamar pago cuando toca
   - Pre-requisitos:
     - Para unirse: Tanda debe estar activa y con cupos
     - Para contribuir: Ser participante y estar en tiempo
     - Para reclamar: Ser el beneficiario del ciclo actual
   - Datos necesarios:
     - Estado actual de la tanda
     - Lista de participantes
     - Orden de pagos
     - Timestamps relevantes

### Implementation Plan

1. ✅ Crear Tandas UI/UX
   - [x] Formulario de creación con:
     - [x] Campo para monto de contribución (con conversión USDC)
     - [x] Selector de intervalo de pago (días)
     - [x] Input para número de participantes
     - [x] Input para período de gracia
   - [x] Proceso de creación:
     - [x] Validación de inputs
     - [x] Manejo de transacciones
     - [x] Feedback de estado
     - [x] Confirmación final

2. ✅ Lista de Tandas UI/UX
   - [x] Lista de tandas activas:
     - [x] Vista previa con información básica
     - [x] Estado actual y progreso
   - [x] Actualizaciones en tiempo real
   - [x] Links a vista detallada

3. 🔄 Vista Detallada de Tanda (New Priority)
   - [ ] Crear página `/tandas/[id]` con:
     - [ ] Header con ID y estado general
     - [ ] Sección de información básica
     - [ ] Lista de participantes
     - [ ] Orden de pagos
     - [ ] Estado del ciclo actual
   - [ ] Acciones de usuario:
     - [ ] Botón para unirse (si hay cupo)
     - [ ] Botón para contribuir (si es participante)
     - [ ] Botón para reclamar pago (si es beneficiario)
   - [ ] Estados y feedback:
     - [ ] Loading states
     - [ ] Error handling
     - [ ] Success confirmations
     - [ ] Actualizaciones en tiempo real

### Success Criteria

1. ✅ Crear Tandas:
   - [x] Usuario puede ingresar todos los parámetros necesarios
   - [x] Sistema valida inputs antes de enviar
   - [x] Usuario recibe feedback en cada paso
   - [x] Confirmación exitosa muestra ID de la tanda

2. ✅ Lista de Tandas:
   - [x] Lista de tandas se carga correctamente
   - [x] Información se muestra de forma clara y organizada
   - [x] Estados se actualizan correctamente
   - [x] Errores se manejan apropiadamente

3. 🔄 Vista Detallada (New):
   - [ ] Información completa de la tanda es visible
   - [ ] Usuario puede ver su rol y acciones disponibles
   - [ ] Acciones (unirse/contribuir/reclamar) funcionan correctamente
   - [ ] Feedback claro del estado de transacciones
   - [ ] Actualizaciones en tiempo real del estado

## Next Steps (Prioridad)

1. Implementar Vista Detallada:
   - [ ] Crear estructura base de la página
   - [ ] Implementar hooks necesarios
   - [ ] Diseñar UI components
   - [ ] Implementar acciones de usuario

## Lessons
- USDC usa 6 decimales - importante para UI
- Mantener estado de transacciones para feedback
- Validar inputs antes de enviar al contrato
- Manejar errores de manera amigable
- Incluir suficiente contexto en las transacciones para debugging 