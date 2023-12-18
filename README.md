# Taller3

Asegúrate de tener instalados Node.js, npm y .NET en tu máquina antes de comenzar. https://nodejs.org/en/download/

Se requiere de la version .NET 7 SDK https://dotnet.microsoft.com/en-us/download/visual-studio-sdks

## Consideraciones previas

Se necesita de un emulador android, de preferencia android studio version giraffe 2022.3.1 : https://developer.android.com/studio?hl=es-419
Acepte los terminos y condiciones para poder descargar el software.

Luego de haber descargado todo lo necesario, procede a instalar android studio con el objetivo de crear un emulador android

al iniciar por primera vez le pedira si quiere importar su configuracion anterior, de preferencia elija 'Do not import settings' y pulse 'Ok'

Una vez abierto android studio giraffe (si es primera vez) se le mostrara la ventana de 'Welcome'
-
- pulse 'Next'
- Escoja el setup 'Standard' y pulse 'Next'
- Seleccione el tema de UI de su preferencia y pulse 'Next'
- pulse 'Next'
- Ahora en la ventana de nombre 'License Agreement' Acepte las 2 o 3 licencias que se le solicitan. (android-sdk-license, android-sdk-arm-dbt-licence y intel-android-extra-license) y pulse 'Finish'


Una vez abierto Android Studio Giraffe se le mostrara una ventana de nombre 'Welcome to Android Studio'
-
- pulse en 'More Actions'
- haga click en 'Virtual Device Manager'
- Haga click en 'Create Device'
- (Asegurese de estar en la categoria 'Category' de 'Phone', luego decida entre un dispositivo 'Pixel 2' o el de su preferencia.
- Una vez seleccionado haga click en 'Next'

Ahora estara en la sección 'Select a system image'
-
- En la pestaña 'Recommended' escoja en el apartado de 'Release Name' la imagen 'API 34' (si no tiene la imagen, haga click en el icono al lado derecho del nombre, se iniciara una descarga, cuando la descarga termine pulse 'Finish')
- Haga click en 'Next'
- (en caso de que no tenga la imagen, esta se descargara, en caso de que el proceso lo haya redirigido a la pagina de inicio, vuelva a realizar los pasos hasta llegar a este punto nuevamente)
- Agreguele un nombre a su dispositivo
- Finalmente pulse 'Finish'

Luego de crear un dispositivo android
-
- Aparecera una nueva ventana donde estara el emulador android creado.
- Haga click en el icono 'Play' del dispositivo creado
- (puede que este proceso tarde la primera vez, porfavor espere que carge el emulador)
- Una vez realizado esto esta listo para seguir con el resto del setup.




## Backend (.NET 7)
Abre la carpeta del backend:

cd backend

Restaura los paquetes NuGet:

dotnet restore

Finalmente inicia el servidor:

dotnet run

## Frontend (React native)

Abre la carpeta del frontend:

cd frontend

Instala las dependencias

npm install

Inicia la aplicación

npx expo start

Una vez ya iniciada la aplicación y el emulador android encendido, dirijase a la misma terminal donde uso 'npx expo start'

presione 'a'

en el emulador se instalara Expo, una vez finalizado podra interactuar con la aplicación desde el emulador android.



