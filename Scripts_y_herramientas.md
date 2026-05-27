# Scripts y herramientas

# After Effects
## 2D Parameter to Null - DEPRECATED - OBSOLETO

**¿Qué hace?**
El script crea un *null* por cada propiedad de punto (x,y) de efectos seleccionados en tu comp. Ese null se coloca en la posición actual del punto y la propiedad se vincula a él con una expresión, para que puedas animarla o moverla desde el null en el comp.

**OBSOLETO / DEPRECATED**
AFTER EFFECTS HA METIDO UNA COSA ASI POR DEFECTO CUANDO HACES BOTÓN DERECHO EN UNA PROPIEDAD

**Cómo usarlo**
Abre tu comp, selecciona una o varias propiedades de punto de un efecto (por ejemplo *Center* de Turbulent Displace) y ejecuta el script. Automáticamente tendrás nulls con nombres tipo `C_[Efecto]_[Propiedad]`, ya conectados por expresión.
**Qué crea**
Cada propiedad seleccionada genera un null en la comp, con el nombre del efecto y la propiedad, y con una expresión que traduce bien las coordenadas (de comp a capa). Así el null controla directamente la posición del punto del efecto.
**Limitaciones**
Funciona solo con propiedades 2D (x,y). Si renombras o borras el null, la propiedad vuelve a su valor original. No sirve para propiedades 3D ni para controles que no sean puntos.
**Usos típicos**
Animar centros de efectos (Glow, Turbulent Displace, Lens Flare), sincronizar varios puntos con nulls fáciles de mover, o crear rigs de control más limpios y prácticos dentro de la comp.

https://www.dropbox.com/scl/fi/adw07r94tsyqz414imq76/2DPrameterToNull.jsx?dl=0&rlkey=jkwjy3i6euaz643cp0fhcrlkj


[https://www.dropbox.com/scl/fi/adw07r94tsyqz414imq76/2DPrameterToNull.jsx?rlkey=jkwjy3i6euaz643cp0fhcrlkj&st=87954pd1&dl=0](https://www.dropbox.com/scl/fi/adw07r94tsyqz414imq76/2DPrameterToNull.jsx?rlkey=jkwjy3i6euaz643cp0fhcrlkj&st=87954pd1&dl=0)

## Create Face Rig

**¿Qué hace?**
Abre un panel “Face Rig Creator” que crea dos nulls de control (`Head_Control` y `Look_Control`) y aplica una expresión de *parallax* (según un multiplicador 0–1) a la **posición** de las capas seleccionadas, usando la posición de `Look_Control` como driver.
**Cómo usarlo**
Ejecuta el script para abrir el panel, selecciona en la comp una capa “referencia” y pulsa **Create Control Nulls** (crea los nulls y parenta la capa al `Head_Control`). Luego selecciona las capas a afectar (evita los nulls), ajusta el **multiplier** con el slider/caja, y pulsa **Apply to Selected Layers** para añadir la expresión de parallax.
**Qué crea**
`Head_Control` (en la posición de la capa referencia) y `Look_Control` (hijo del Head, en [0,0] relativo con escala 50%). A las capas seleccionadas les añade en **Position**: `value + thisComp.layer('Look_Control').transform.position * multiplier;`.
**Limitaciones**
Solo afecta **posición 2D** y no debe aplicarse a los propios `Head_Control`/`Look_Control`. Si cambias los nombres de los nulls, la expresión se rompe. No gestiona depth 3D real; es un faux-parallax basado en offset 2D.
**Usos típicos**
Rigs faciales 2D rápidos: mover `Look_Control` para simular mirada, desplazamiento de cejas, mofletes, nariz, etc., con distintos multiplicadores por capa para sensación de profundidad y respuesta sutil al *head turn*.

https://www.dropbox.com/scl/fi/22a72nvgnf2hl5xkq1fgy/CreateFaceRig.jsx?dl=0&rlkey=l80v4u1w03f62grbz1zxdde2p


[https://www.dropbox.com/scl/fi/22a72nvgnf2hl5xkq1fgy/CreateFaceRig.jsx?rlkey=l80v4u1w03f62grbz1zxdde2p&st=i3h5ai0l&dl=0](https://www.dropbox.com/scl/fi/22a72nvgnf2hl5xkq1fgy/CreateFaceRig.jsx?rlkey=l80v4u1w03f62grbz1zxdde2p&st=i3h5ai0l&dl=0)

## Delete If No Children Or Matte

**¿Qué hace?**
El script actúa como un "filtro de seguridad" para la limpieza de tu timeline. Analiza las capas seleccionadas y solo elimina aquellas que no tengan una función de dependencia activa. Específicamente, protege y **no borra** ninguna capa que esté sirviendo como "Padre" de otra o que esté siendo utilizada como "Track Matte" (Mate de seguimiento) por otra capa del proyecto.
**Cómo usarlo**
Selecciona un grupo de capas que creas que son redundantes o "basura" en tu composición y ejecuta el script. El script procesará la selección, eliminará las que realmente no hacen nada y te mostrará un cuadro de alerta listando los nombres de las capas que decidió conservar y el motivo (si es por ser Padre o por ser Fuente de Mate).
**Qué crea**
No crea ningún elemento nuevo. Su función es exclusivamente de **limpieza inteligente**. Al ejecutarse, realiza un escaneo inverso de tu selección para evitar errores de índice y verifica mediante código si cada capa tiene hijos vinculados o si es el motor visual de un mate de seguimiento en cualquier otra capa de la composición.
**Limitaciones**
El script está optimizado para versiones modernas de After Effects (23.0 en adelante) al utilizar la propiedad `trackMatteLayer`. Solo analiza las capas que tengas **seleccionadas previamente**; no escanea toda la composición automáticamente para evitar borrar elementos que podrías querer mantener por otras razones.
**Usos típicos**
Hacer limpieza profunda en proyectos pesados sin miedo a romper el "rigging" o los mates, optimizar composiciones con cientos de capas donde no estás seguro de qué Null o sólido es prescindible, y asegurar que al borrar capas de referencia no dejes huérfanas a otras que dependen de su posición o su canal alfa.

https://www.dropbox.com/scl/fi/4eu4d2jfyotz5r9pn4tz9/DeleteIfNoChildrenOrMatte.jsx?dl=0&rlkey=b7nyy38duv1r20cfcr5tju9dx


[https://www.dropbox.com/scl/fi/4eu4d2jfyotz5r9pn4tz9/DeleteIfNoChildrenOrMatte.jsx?rlkey=b7nyy38duv1r20cfcr5tju9dx&st=gmngma5f&dl=0](https://www.dropbox.com/scl/fi/4eu4d2jfyotz5r9pn4tz9/DeleteIfNoChildrenOrMatte.jsx?rlkey=b7nyy38duv1r20cfcr5tju9dx&st=gmngma5f&dl=0)

## Dissolve Parent

**¿Qué hace?**
El script elimina una capa seleccionada (padre) y transfiere automáticamente todos sus "hijos" al siguiente nivel de la jerarquía. Si la capa eliminada tenía a su vez un padre, los hijos se vinculan a ese abuelo; si no tenía padre, los hijos quedan libres, pero manteniendo su posición actual en el espacio.
**Cómo usarlo**
Abre tu composición, selecciona **exactamente una capa** que esté actuando como padre de otras y ejecuta el script. El script reasignará los vínculos de parentesco de todas las capas dependientes y borrará la capa seleccionada en un solo paso.
**Qué crea**
No crea objetos nuevos. Lo que hace es una **reestructuración de la jerarquía** en el timeline. El script utiliza la lógica interna de After Effects para que, al reasignar el padre, las capas "hijas" no salten de posición ni cambien sus transformaciones, manteniendo visualmente el diseño original.
**Limitaciones**
Solo funciona si tienes **una sola capa seleccionada**. Si intentas ejecutarlo sin seleccionar nada o con varias capas elegidas a la vez, el script mostrará un aviso y no realizará ninguna acción. Está diseñado para limpiar la jerarquía de una en una.
**Usos típicos**
Limpiar nulls innecesarios en un rig, eliminar capas de referencia una vez que ya no se necesitan sin romper la animación de los hijos, o simplificar estructuras de parentesco complejas (pasando los vínculos de un "padre" directamente al "abuelo") para tener un timeline más organizado.

https://www.dropbox.com/scl/fi/q7v28brcm31fcvej1uio4/DissolveParent.jsx?dl=0&rlkey=u7q9lxu7lobtv1y3xq229ikj9


[https://www.dropbox.com/scl/fi/q7v28brcm31fcvej1uio4/DissolveParent.jsx?rlkey=u7q9lxu7lobtv1y3xq229ikj9&st=08rivq6e&dl=0](https://www.dropbox.com/scl/fi/q7v28brcm31fcvej1uio4/DissolveParent.jsx?rlkey=u7q9lxu7lobtv1y3xq229ikj9&st=08rivq6e&dl=0)

## ES to EN Expressions

**¿Qué hace?**
El script escanea todo tu proyecto de After Effects en busca de expresiones que utilicen nombres de controladores en español y los traduce automáticamente al inglés. Esto corrige el error común de `"Property or method named 'Deslizador' missing"` que ocurre al compartir archivos entre usuarios con el software en distintos idiomas.
**Cómo usarlo**

1. Guarda tu proyecto antes de empezar (por seguridad).
2. Ve a **File > Scripts > Run Script File...** y selecciona este archivo `.jsx`.
3. El script recorrerá todas las composiciones, capas y propiedades del proyecto de forma automática.
4. Al finalizar, aparecerá un aviso de "Reemplazo ES > EN terminado".

**Qué modifica**
El script busca dentro de las cadenas de texto de tus expresiones (entre comillas) y realiza los siguientes cambios:

- `"Deslizador"` → `"Slider"`
- `"Punto"` → `"Point"`
- `"Casilla de verificación"` o `"Casilla"` → `"Checkbox"`
- `"Ángulo"` o `"Angulo"` → `"Angle"`
- `"Color"` → `"Color"`
- `"Capa"` → `"Layer"`

**Limitaciones**

- **Solo texto entre comillas:** El script busca coincidencias exactas como `"Deslizador"`. Si la expresión no usa comillas para referirse al control, no lo detectará.
- **Unidireccional:** Está diseñado específicamente para pasar de **Español a Inglés**.
- **Propiedades personalizadas:** No traduce nombres de efectos o capas que tú hayas renombrado manualmente, solo los nombres por defecto de los "Expression Controls".

**Usos típicos**

- **Preparar plantillas (Templates):** Antes de vender o compartir un proyecto globalmente para asegurar la compatibilidad internacional.
- **Limpieza de proyectos:** Corregir errores de expresión tras haber cambiado el idioma de la interfaz de After Effects de español a inglés.
- **Colaboración:** Normalizar el código cuando trabajas con un equipo que utiliza diferentes versiones regionales del software.
https://www.dropbox.com/scl/fi/oq4z5c2zxmjpqmhg43cxf/EStoENxpressions.jsx?dl=0&rlkey=sxh0wkxbsse4v73idqp74ry52

    [https://www.dropbox.com/scl/fi/oq4z5c2zxmjpqmhg43cxf/EStoENxpressions.jsx?rlkey=sxh0wkxbsse4v73idqp74ry52&st=iz544aoz&dl=0](https://www.dropbox.com/scl/fi/oq4z5c2zxmjpqmhg43cxf/EStoENxpressions.jsx?rlkey=sxh0wkxbsse4v73idqp74ry52&st=iz544aoz&dl=0)
## Freeze Property

**¿Qué hace?**
“Congela” propiedades seleccionadas convirtiendo su valor actual en una expresión fija, redondeada a dos decimales. Así puedes bloquear posiciones animadas, escalas, opacidades, etc., de forma limpia sin tener que escribir keyframes.
**Cómo usarlo**
Selecciona en tu comp las propiedades que quieras congelar (posición, escala, rotación, opacidad, puntos de efecto…) y ejecuta el script. Sustituirá su valor por una expresión que devuelve ese mismo número (ya redondeado).
**Qué crea**
En cada propiedad añade una expresión simple:

- Si es multidimensional (ej. posición), `value = [x, y];` con valores redondeados.
- Si es un valor único, `value = n;`.
- Además muestra un resumen de cuántas propiedades procesó y cuántas no pudo tocar.

**Limitaciones**
Solo funciona en propiedades que aceptan expresiones (`canSetExpression = true`). Si seleccionas algo que no admite, lo salta. No añade keyframes, solo reemplaza por un valor constante vía expresión.
**Usos típicos**
Bloquear posiciones/opacidades animadas en un sitio que nos venga mejor para modificarlas.

https://www.dropbox.com/scl/fi/2iq4o4acakzgrulgvy2wk/FreezeProperty.jsx?dl=0&rlkey=mymdwhuhvk7x8dzav6mln2zf1


[https://www.dropbox.com/scl/fi/2iq4o4acakzgrulgvy2wk/FreezeProperty.jsx?rlkey=mymdwhuhvk7x8dzav6mln2zf1&st=hfpm5adn&dl=0](https://www.dropbox.com/scl/fi/2iq4o4acakzgrulgvy2wk/FreezeProperty.jsx?rlkey=mymdwhuhvk7x8dzav6mln2zf1&st=hfpm5adn&dl=0)

## Move And Trim

**¿Qué hace?**
Ajusta automáticamente las capas seleccionadas para que se alineen en el tiempo con la capa justo debajo: mueve su inicio para que coincida y recorta su duración para que termine al mismo tiempo.
**Cómo usarlo**
Selecciona una o varias capas en tu comp y ejecuta el script. Cada capa se moverá y recortará tomando como referencia la capa inmediatamente inferior en la pila.
**Qué cambia**
Modifica `startTime` y `outPoint` de las capas seleccionadas, basándose en los valores de la capa inferior. No crea nada nuevo, solo ajusta tiempo y duración.
**Limitaciones**
Funciona solo si existe una capa debajo (no aplica a la última capa del comp). Puede solapar o desplazar capas si ya tenían keyframes fuera del rango.
**Usos típicos**
Muy útil para montar capas en secuencia, sincronizar assets con placeholders o ajustar rápidamente varios elementos para que sigan el timing de una referencia.

https://www.dropbox.com/scl/fi/07h4tmamqm9jnv1tgnh1s/MoveAndTrim.jsx?dl=0&rlkey=jyzuzzh3gu7afrodp06p5uxr5


[https://www.dropbox.com/scl/fi/07h4tmamqm9jnv1tgnh1s/MoveAndTrim.jsx?rlkey=jyzuzzh3gu7afrodp06p5uxr5&st=meoyegqd&dl=0](https://www.dropbox.com/scl/fi/07h4tmamqm9jnv1tgnh1s/MoveAndTrim.jsx?rlkey=jyzuzzh3gu7afrodp06p5uxr5&st=meoyegqd&dl=0)

## Null Group

**¿Qué hace?**
Crea un *null* en el centro promedio de las capas seleccionadas (solo las que no tienen padre), ajusta su duración para cubrir desde el inicio más temprano hasta el final más tarde de esas capas, y luego las emparenta al null.
**Cómo usarlo**
Selecciona varias capas en tu comp y ejecuta el script. Automáticamente aparecerá un null en el centro de todas, con la duración sincronizada, y las capas quedarán vinculadas como hijos.
**Qué cambia**
Genera un nuevo null, calcula posición media (`averagePosition`) y rango de tiempo (in/out), y reasigna la jerarquía de las capas seleccionadas a ese null.
**Limitaciones**
Ignora capas que ya tienen padre. Si todas están parentadas, no hará nada. Funciona en 2D y 3D (suma también la Z si existe).
**Usos típicos**
Agrupar rápidamente varias capas para moverlas o animarlas juntas, crear un control centralizado para un grupo, o mantener organizado un rig sin necesidad de precomponer.

https://www.dropbox.com/scl/fi/sosql103z38jichzmcks1/NullGroup.jsx?dl=0&rlkey=s8g1d2wjvq1wzhpq61vh3akd1


[https://www.dropbox.com/scl/fi/sosql103z38jichzmcks1/NullGroup.jsx?rlkey=s8g1d2wjvq1wzhpq61vh3akd1&st=mggcezuj&dl=0](https://www.dropbox.com/scl/fi/sosql103z38jichzmcks1/NullGroup.jsx?rlkey=s8g1d2wjvq1wzhpq61vh3akd1&st=mggcezuj&dl=0)

## PuppetPin Null Creator

**¿Qué hace?**
Crea un *null* por cada **Puppet Pin** de la malla en la capa seleccionada, los coloca sobre cada pin, les da el mismo rango de in/out que la capa y **encadena los nulls en jerarquía** (cada nuevo null se parenta al anterior) para facilitar rigs articulados; además, a cada pin le aplica una expresión para que siga al null correspondiente.
**Cómo usarlo**
Selecciona la **capa con Puppet** en tu comp y ejecuta el script; detecta todas las mallas (`Puppet > arap > Mesh > Deform`) y genera los nulls automáticamente con nombres `"\[NombreCapa\] [NombreMalla] [NombrePin]"`, ya vinculados por expresión y listos para animar.
**Qué cambia**
Añade nulls (escala 50%, *shy* activado, ancla 50/50) parentados en cadena y ajusta `pin.position.expression` a `p=thisComp.layer("NombreNull"); fromComp(p.toComp(p.anchorPoint));` para convertir coordenadas comp↔capa y hacer que el pin siga al null.
**Limitaciones**
Opera solo sobre la **primera capa seleccionada** con Puppet; el encadenado es estrictamente secuencial (del último pin al primero por el orden del bucle), renombrar un null rompe su vínculo en la expresión, y está pensado para Puppet **2D (FreePin3/ARAP)** en rutas de propiedades estándar.
**Usos típicos**
Rig rápido de extremidades y caras: mover nulls para posar pins con control limpio, crear cadenas de influencia (hueso→subhueso), y preparar setups de animación donde necesites *handles* tangibles en timeline en lugar de manipular directamente los pins.

https://www.dropbox.com/scl/fi/b0t7bz9kyo7xdu5lrlf8u/PupperPin_NullCreator.jsx?dl=0&rlkey=7518l66okrvn1wr1h02fff0nc


[https://www.dropbox.com/scl/fi/b0t7bz9kyo7xdu5lrlf8u/PupperPin_NullCreator.jsx?rlkey=7518l66okrvn1wr1h02fff0nc&st=emgo6rrp&dl=0](https://www.dropbox.com/scl/fi/b0t7bz9kyo7xdu5lrlf8u/PupperPin_NullCreator.jsx?rlkey=7518l66okrvn1wr1h02fff0nc&st=emgo6rrp&dl=0)


## Project Folder Helper

**¿Qué hace?**
El script te permite "clonar" la organización de tu ventana de Proyecto. Puedes exportar toda tu jerarquía de carpetas actual a un archivo de texto simple (.txt) y luego importarlo en cualquier proyecto nuevo para recrear esa misma estructura automáticamente, manteniendo el orden de carpetas y subcarpetas.
**Cómo usarlo**
Ejecuta el script desde el menú *File > Scripts*. Si ya tienes una estructura que te gusta, pulsa **"Export Structure (.txt)"** para guardarla. En un proyecto nuevo, pulsa **"Import Structure (.txt)"** y selecciona ese archivo; el script se encargará de construir todo el árbol de carpetas por ti en un segundo.
**Qué crea**
Genera elementos de tipo "Folder" en la ventana de Proyecto. El script utiliza un sistema de rutas de texto (por ejemplo: `04_VIDEO/FOOTAGE`), lo que significa que detecta qué carpetas van dentro de otras y las organiza exactamente como estaban en el original, sin importar cuántos niveles de profundidad tengan.
**Limitaciones**
Solo recrea la **estructura de carpetas** (el "esqueleto" del proyecto). No exporta ni importa los archivos, composiciones o material de archivo (footage) que haya dentro. Además, si decides editar el archivo .txt a mano, asegúrate de mantener el formato de nombres separados por barras `/` para que el script no se pierda.
**Usos típicos**
Estandarizar el flujo de trabajo en un equipo para que todos usen la misma nomenclatura, configurar proyectos nuevos en segundos sin tener que crear carpetas a mano ("GYST"), o guardar diferentes plantillas de organización según el tipo de trabajo (ej. una para Redes Sociales y otra para VFX).

https://www.dropbox.com/scl/fi/3wkq2txzutj41ct9ntuf5/ProjectFolderHelper.jsx?dl=0&rlkey=ngv760vybpmkkoj08rben8u1e


https://www.dropbox.com/scl/fi/3wkq2txzutj41ct9ntuf5/ProjectFolderHelper.jsx?rlkey=ngv760vybpmkkoj08rben8u1e&dl=0

## Simple Parent

**¿Qué hace?**
Emparenta todas las capas seleccionadas al último layer de la selección. De esta forma puedes elegir rápidamente un “padre” sin ir capa por capa al menú de *Parent & Link*.
**Cómo usarlo**
Selecciona al menos dos capas en la comp (la última que marques será el padre) y ejecuta el script. Todas las demás capas seleccionadas quedarán vinculadas a esa.
**Qué cambia**
No crea nada nuevo: solo asigna la propiedad `parent` de cada capa seleccionada al último layer de la selección.
**Limitaciones**
Necesita mínimo dos capas; si seleccionas solo una o ninguna, no hace nada. No diferencia entre capas 2D/3D ni preserva offsets, simplemente parenta directo.
**Usos típicos**
Organizar jerarquías rápidas (p. ej. varios elementos a un null de control), ahorrar tiempo en rigs, o vincular varios assets a una cámara/luz/capa guía con un clic.

https://www.dropbox.com/scl/fi/54oae1yw27u7kdp4wx50t/SimpleParent.jsx?dl=0&rlkey=fyy26lcg6n7vvpyr7tfcchjqd


[https://www.dropbox.com/scl/fi/54oae1yw27u7kdp4wx50t/SimpleParent.jsx?rlkey=fyy26lcg6n7vvpyr7tfcchjqd&st=joyrji9m&dl=0](https://www.dropbox.com/scl/fi/54oae1yw27u7kdp4wx50t/SimpleParent.jsx?rlkey=fyy26lcg6n7vvpyr7tfcchjqd&st=joyrji9m&dl=0)

## Trim To Keys

**¿Qué hace?**
Recorta automáticamente las capas seleccionadas para que su duración vaya desde el primer hasta el último keyframe que contengan, quitando tiempo sobrante al inicio y al final.
**Cómo usarlo**
Selecciona una o varias capas en tu comp y ejecuta el script. Analiza todos sus parámetros y ajusta `inPoint` y `outPoint` de cada capa según los keyframes más temprano y más tardío.
**Qué cambia**
No crea nada nuevo: solo modifica la entrada y salida de las capas para que coincidan con el rango de sus animaciones.
**Limitaciones**
Si una capa no tiene keyframes, no se recorta. No distingue propiedades bloqueadas ni efectos expresados sin keyframes.
**Usos típicos**
Limpieza de comps, recortar automáticamente assets animados, preparar precomps optimizadas o eliminar tramos vacíos en timelines largos.

https://www.dropbox.com/scl/fi/l8xll9htuzofseoxrig6r/TrimToKeys.jsx?dl=0&rlkey=5axv307jbxk84ta4y9qdfvqfn


[https://www.dropbox.com/scl/fi/l8xll9htuzofseoxrig6r/TrimToKeys.jsx?rlkey=5axv307jbxk84ta4y9qdfvqfn&st=l23isv31&dl=0](https://www.dropbox.com/scl/fi/l8xll9htuzofseoxrig6r/TrimToKeys.jsx?rlkey=5axv307jbxk84ta4y9qdfvqfn&st=l23isv31&dl=0)

# Illustrator
## Renombrator

**¿Qué hace?**
Abre un cuadro de diálogo que permite renombrar todas las mesas de trabajo del documento activo en secuencia, con prefijo, número inicial y opción de rellenar con ceros.
**Cómo usarlo**
Ejecuta el script con un documento abierto. Ajusta en la ventana el **prefijo**, el **número inicial** y si quieres **ceros a la izquierda** (con la cantidad de dígitos). La vista previa muestra cómo quedarán los nombres. Pulsa **Renombrar** y todas las mesas se renombrarán de forma consecutiva.
**Qué cambia**
Modifica los nombres de todas las mesas de trabajo en el documento. Por ejemplo, con prefijo `Mesa_`, número inicial `1` y 3 dígitos, se generan `Mesa_001`, `Mesa_002`, `Mesa_003`, etc.
**Limitaciones**
Solo afecta al documento activo y a todas sus mesas (no permite seleccionar algunas). Los caracteres problemáticos en el prefijo se sustituyen por guiones bajos `_`.
**Usos típicos**
Organizar mesas de trabajo para exportación masiva, preparar secuencias numeradas de assets, mantener orden claro en proyectos grandes o facilitar flujos con After Effects u otros programas que dependen de nombres ordenados.

https://www.dropbox.com/scl/fi/9jg75rgbjfwtju6k0to7q/Renombrator_AI.jsx?dl=0&rlkey=joy9kr305ob20w4xjzk48pz83


[https://www.dropbox.com/scl/fi/9jg75rgbjfwtju6k0to7q/Renombrator_AI.jsx?rlkey=joy9kr305ob20w4xjzk48pz83&st=95gp4w66&dl=0](https://www.dropbox.com/scl/fi/9jg75rgbjfwtju6k0to7q/Renombrator_AI.jsx?rlkey=joy9kr305ob20w4xjzk48pz83&st=95gp4w66&dl=0)

## Sort Layers Left to right

**¿Qué hace?**
Ordena todos los objetos de la capa activa de izquierda a derecha, y si dos comparten la misma posición en X, de arriba hacia abajo. Al final cambia su orden de apilado (*z-order*) en la capa para reflejar ese orden.
**Cómo usarlo**
Selecciona la capa donde tengas los objetos que quieres ordenar y ejecuta el script. Te mostrará cuántos elementos encontró, luego los reordena automáticamente. No necesitas seleccionar los objetos, el script usa **todos los elementos de la capa activa**.
**Qué crea/cambia**
No genera elementos nuevos: simplemente cambia el orden en el panel de capas. Usa la coordenada `left` como referencia de X y `top` como referencia de Y. Para líneas (PathItem con 2 puntos) calcula el centro para que el orden sea más lógico.
**Limitaciones**
Afecta solo a objetos en la **capa activa**. No discrimina por grupos o subcapas: todo lo que haya en la capa se incluye. Y ten en cuenta que “top” en Illustrator aumenta hacia abajo, por eso el cálculo se invierte para ordenar correctamente de arriba a abajo.
**Usos típicos**
Preparar capas para exportar secuencias en orden visual, organizar elementos antes de renombrar o numerar, o tener el orden lógico de lectura (de izquierda a derecha, arriba abajo) al generar assets para animación o desarrollo.

https://www.dropbox.com/scl/fi/uvvaefw5rz1gycpnnd3q5/Sort_Layers_LeftToRight.jsx?dl=0&rlkey=mqgp4f54mhvoqevjfm1xrktpa


[https://www.dropbox.com/scl/fi/uvvaefw5rz1gycpnnd3q5/Sort_Layers_LeftToRight.jsx?rlkey=mqgp4f54mhvoqevjfm1xrktpa&st=wg51kyg9&dl=0](https://www.dropbox.com/scl/fi/uvvaefw5rz1gycpnnd3q5/Sort_Layers_LeftToRight.jsx?rlkey=mqgp4f54mhvoqevjfm1xrktpa&st=wg51kyg9&dl=0)

## Sort Layers Reading Order

**¿Qué hace?**
Ordena los objetos de la capa activa siguiendo un orden de lectura más natural: de arriba a abajo, y dentro de cada “línea” (según cercanía en Y) de derecha a izquierda. Esto simula cómo recorrerías texto o elementos en bloques.
**Cómo usarlo**
Activa la capa que quieras ordenar y ejecuta el script. Detecta todos los objetos, calcula su centro, los organiza según la lógica de lectura (líneas y columnas) y reordena su posición en el panel de capas.
**Qué cambia**
No crea nada nuevo, solo reordena los objetos. Usa el centro de cada objeto para calcular la posición. Si dos objetos están en la misma “línea” (diferencia en Y menor a `epsilon` = 50 px), entonces decide el orden usando X.
**Limitaciones**
El rango de tolerancia (`epsilon`) define qué se considera “misma línea”: si es muy bajo, objetos alineados pueden caer en distintas filas; si es muy alto, varios niveles pueden mezclarse. Funciona solo en la capa activa, sin distinguir subcapas.
**Usos típicos**
Ideal para ordenar ítems como si fueran párrafos o grids: iconos, casillas, números o letras que deban seguir un orden de lectura coherente (arriba–abajo, derecha–izquierda). Muy útil antes de exportar secuencias o preparar material para motion.

https://www.dropbox.com/scl/fi/atv1mwizhj4ept8qnnmpy/Sort_Layers_ReadingOrder.jsx?dl=0&rlkey=twvomxaf82mfn0sw5f7jym5xe


[https://www.dropbox.com/scl/fi/atv1mwizhj4ept8qnnmpy/Sort_Layers_ReadingOrder.jsx?rlkey=twvomxaf82mfn0sw5f7jym5xe&st=q2ttwc7z&dl=0](https://www.dropbox.com/scl/fi/atv1mwizhj4ept8qnnmpy/Sort_Layers_ReadingOrder.jsx?rlkey=twvomxaf82mfn0sw5f7jym5xe&st=q2ttwc7z&dl=0)

