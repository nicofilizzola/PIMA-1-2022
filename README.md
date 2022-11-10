# Ce qu'il vous faut

Pour pouvoir lancer le projet, il vous faut installer :

* [Node.js](https://nodejs.org/en/) pour avoir accès à npm. Je vous conseille d'installer la version LTS ;
* Le CLI de Angular. Pour l'installer, il faut déjà avoir Node et puis taper ça dans le terminal : `npm install -g @angular/cli`

# Choses importantes

* Pour lancer le projet utilisez la commande `ng serve` dans votre terminal. Faites attention de bien vous trouver dans le répertoire correcte, sinon ça marchera pas.
* Après la première fois que vous avez pull le projet angular, il faudra installer toutes les dépendances spécifiées dans le package JSON sur votre machine. Pour ceci utilisez la commande `npm install`. **Disclaimer, cela peut prendre un peut de temps.**

# Récupération des données de l'API

La mobilisation des données de l'API se fait à travers deux services :
* Le `GcalHttpService`, qui fait les appels et la communication directement avec l'API, et qui les stocke dans `GcalStorageService`. Vous n'aurez donc à toucher ce service là que si vous devez modifier les appels API.
* Le `GcalRequesHandlerService`, qui fait les opérations nécéssaires pour 'fetcher' les données de l'API correctement.
* Le `GcalStorageService`, qui contient les données récupérés par l'API et qui les met à disposition pour les différents éléments (**components, services, etc**) de l'application. Ce service sert donc en tant que **storage global**, et chaque élément doit donc contenir son **storage local**. Ce service propose ainsi un certain nombre de méthodes permettant de récupérer et de trier les données du storage global, afin de proposer une gestion simplifiée des données pour chaque élément avec un minimum de requêtes HTTP.

## Utilisation de GcalStorageService

Pour utiliser les données stockées dans `GcalStorageService`, vous devez comprendre le fonctionnement de l'observable `dataFetched$`.
Celui-ci envoie un signal dès qu'il est determiné au niveau de `GcalRequesHandlerService` que la récupération des données a fini. Il est donc nécessaire que les getters de `GcalStorageService` soient dans le contexte d'un subscribe de `dataFetched$`, dans le but de :
* Garantir que l'opération soit repétée dynamiquement à chaque fois qu'un nouveau fetch est complété ;
* Eviter d'utiliser un getter qui va chercher dans le storage alors que la variable pourrait être encore indéfinie.

Voici un exemple indicatif d'utilisation dans un component :
```js
...
displayedEvents;
constructor(..., private _gcalStorageService: GcalStorageService, ...) { ... }
...
this._gcalStorageService.dataFetched$.subscribe(() => {
  // On met ici nos getters
  this.displayedEvents = this.getEvents()
})
...`
  
# Tuto angular

Dans cette section vous pourrez revoir les bases d'Angular. Pour rappel Angular est un framework front-end. Il utilise TypeScript, une surcouche de JavaScript permettant d'implémenter du typage et des fonctionnalités de la programmation objet à JS.

Pour plus d'informations vous pouvez toujours consulter [la doc d'Angular](https://angular.io/), il y a tout là dedans.

## Composants

Les composants sont "l'unité principale" utilisé dans Angular. Ils s'écrivent sous forme d'objet et ils sont souvent utilisés afin d'éviter de hardcorder des trucs répétitifs (par exemple une liste avec des <li> qui ont un lien à chaque fois et qui ont un traitement particulier) e. En général ils sont composés de la manière suivante :

* _mon-composant.component.ts_ : Contient l'instantiation du composant ;
* _mon-composant.component.scss_ : Contient le style appliqué sur le composant ;
* _mon-composant.component.spec.ts_ : Contient la partie dediée aux tests unitaires, mais vous n'en avez pas besoin pour faire marcher le composant ;

Pour créer votre propre composant, il suffit d'utiliser le CLI en tapant la commande `ng generate component <nom-du-composant>` ou bien `ng g c <nom-du-composant>` pour faire court.

À savoir, quand on utilise le CLI pour créer un composant, sa classe est automatiquement ajoutée dans la liste de `declarations` dans le module (souvent `AppModule`) donc si on veut en supprimer un il faudrait également mettre à jour le module en question en supprimant dite déclaration.

### Cycle de vie d'un composant
Un des trucs à tenir en compte quand on utilise des composants c'est leur cycle de vie. En gros, ce qu'il faut savoir c'est qu'il existe une méthode `ngOnInit()` qu'on peut définir dans tous nos composants et qui va systématiquement s'exécuter durant l'initialisation du composant (Important, il faut que la classe de votre composant implémente l'interface `OnInit` pour pouvoir vous en servir. On a aussi la méthode `ngOnDestroy()` qui est appelée quand le composant disparaît (Pareil il faut implémenter l'interface `OnDestroy`.

Il y en a plein d'autres que vous pouvez utiliser durant les différentes étapes du cycle de vie mais ces deux là sont les plus importantes. Pour en savoir plus checkez [cette rubrique de la doc.](https://angular.io/guide/lifecycle-hooks)

## Services

Les services sont des classes qui permettent d'isoler des opérations des composants. Le but est de respecter le principe de responsabilité unique en faisant que chaque classe soit dédiée à un truc en spécifique.

Par exemple, si dans ton composant t'as un bouton qui doit faire un appel à une API ou qui doit faire un calcul complexe, il vaut mieux le séparer dans son propre service.

Pour utiliser un service dans un composant, on le met en argument privé dans le constructeur du composant :
`constructor(private _mathService: MyMathService) {}`
Pour rappel, en TypeScript la syntaxe `private mathService: MathService` veut dire qu'il y a une propriété privée nommée `_mathService` et qui es de type `MyMathService`.

Petites notes :
* Oubliez pas de vérifier que votre classe `MyMathService` a bien été importée dans le fichier où vous vous en servez.
* Si vous voyez une variable dont le nom est prefixé d'un `_` comme dans l'exemple précédent ça veut juste dire que c'est une propriété privée. C'est pas obligatoire mais c'est une bonne pratique pour la lisibilité et tout.

Pour créer votre service, vous pouvez taper ça dans le terminal : `ng g s <nom-du-service>` (g s est une abbréviation pour generate service).

## Observables

Les observables sont des trucs qui permettent de gérer les données de manière réactive aux changements, c'est-à-dire qu'on peut déclencher des actions lorsqu'on "observe" si une variable est changée ou mise à jour.

Il existe plusieurs types d'observable :
* Subject
* BehaviorSubject
* ...

À retenir :
* Au moment de déclarer un observable il faut indiquer son type. Par exemple : `private _data = new Subject<string>()`.
* Pour mettre à jour la valeur d'un observable, il suffit d'utiliser la méthode `next`, avec la nouvelle valeur en argument. Par exemple : `this._data.next("bonjour")`
* Pour "observer" les changements d'un observable il faut appeler la méthode `subscribe` sur l'observable. Pour les composants on fait ça d'habitude dans le `ngOnInit` car cette méthode est appelée quand le composant est initialisé (donc ça "observe" depuis l'initialisation du composant). Par exemple : a`this._data.subscribe((observedString: string) => { /* fait des trucs */ })`. Dans la syntaxe précédente la variable `observedString` correspond au nouveau string à chaque fois que l'observable detecte un changement (comme `"bonjour"` quand on a fait `this._data.next("bonjour")`). On peut faire ce qu'on veut avec cette variable dans la partie `/* fait des trucs */` comme le printer, l'exploiter avec un service ou peu importe.

Petites notes :
* Si vous voyez une variable suffixé d'un `$` ça veut dire que c'est un observable. Encore une fois c'est une histoire de convention.
* Si vous voulez en approfondir sur les observables, n'hésitez pas à check [la doc de ngrx.](https://rxjs.dev/guide/observable)
* Je vous recommande fortement de toujours appeler la méthode `unsubscribe` sur vos observables pour des raisons de performance. Cela peut se faire dans le `ngDestroy`.
