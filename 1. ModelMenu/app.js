const { Console } = require("./console");

// Options

class Option {

    static console = new Console();
    #title;

    constructor(title) {
        this.#title = title;
    }

    interact() {};

    showTitle(index) {
        Option.console.writeln(index + ". " + this.getTitle());
    }

    getTitle() {
        return this.#title;
    }

}



// menus

class Menu {

    static console = new Console();
    #title;
    #options;

    constructor(title) {
        this.#title = title;
        this.#options = [];
    }

    interact() {
        this.addOptions();
        this.interact_();
    }

    addOptions(){};

    interact_() {
        this.showTitles();
        this.execChoosedOption();
    }

    showTitles() {
        this.#showTitle();
        for (let i = 0; i < this.#options.length; i++) {
            this.#options[i].showTitle(i + 1);
        }
    }

    #showTitle() {
        let string = "\n" + this.#title + "\n";
        for (let i = 0; i < this.#title.length; i++) {
            string += "-";
        }
        Menu.console.writeln(string);
    }

    execChoosedOption() {
        let answer;
        let ok;
        do {
            answer = this.#readInt("Opción? [1-" + this.#options.length + "]: ") - 1;
            ok = 0 <= answer && answer <= this.#options.length - 1;
            if (!ok) {
                Menu.console.writeln("Error!!!");
            }
        } while (!ok);
        this.#options[answer].interact();
    }

    #readInt(prompt){
        return Number.parseInt(Menu.console.readNumber(prompt));
    }

    add(option) {
        this.#options.push(option);
    }

    removeOptions() {
        this.#options = [];
    }

    hasOption(option) {
        return this.#options.includes(option);
    }

}

// model

class Model {

    #strings;

    constructor() {
        this.#strings = [];
        for (let string of [`Ana`, `Bea`, `Cio`])
            this.#strings.push(string);
    }

    add(string) {
        this.#strings.push(string);
    }

    remove(index) {
        this.#strings.splice(index, 1);
    }

    get(index) {
        return this.#strings[index];
    }

    size() {
        return this.#strings.length;
    }

}

// ModelOptions

class ModelOption extends Option {

    model;

    constructor(string, model) {
        super(string);
        this.model = model;
    }

    interact() {};

}

class ListModelOption extends ModelOption {

    constructor (model) {
        super("Listar", model);
    }

    interact() {
        for (let i = 0; i < this.model.size(); i++) {
            Option.console.writeln((i + 1) + ". " + this.model.get(i));
        }
        Option.console.writeln();
    }

}

class InverseListModelOption extends ModelOption {

    constructor(model) {
        super("Listar inverso", model);
    }

    interact() {
        for (let i = this.model.size() - 1; i >= 0; i--) {
            Option.console.writeln((i + 1) + ". " + this.model.get(i));
        }
        Option.console.writeln();
    }

}

class ListFirstModelOption extends ModelOption {

    constructor(model) {
        super(`Listar primer elemento`,model)
    }
    interact() {
        const FIRST_ELEMENT = 0;
        this.model.size() > FIRST_ELEMENT ?  
        Option.console.writeln("1. " + this.model.get(FIRST_ELEMENT)) : Option.console.writeln(`No hay elementos a listar`);
    }
}

// ModelMenus

class ModelMenu extends Menu {

    #model;

    constructor(model) {
        super("Model Menu");
        this.model = model;
    }

    addOptions() {
        this.add(new ListModelOption(this.model));
        this.add(new InverseListModelOption(this.model));
        this.add(new ListFirstModelOption(this.model));
    }

}

Option.console.writeln("***");
new ModelMenu(new Model()).interact();

// 1. Creamos ModelMenu y lo asocio con el modelo.
// 2. Se llama al conctructor del padre con el nombre del modelo.
// 3. ejecutamos el metodo interact() del padre.
// 4. el metodo interact() del padre llama a addOptions() que es un metodo abstracto implementado en el hijo, ModelMenu.
// 5. en el metodo addOptions() del hijo se definen las diferentes opciones que va a tener el menu ya asociadas con el modelo
//      a usar. Se añaden las opcion mediante el método add() que las guarda en la propiedad options[] del padre.
// 6. Una vez añadidas las opciones, se ejecuta la segunda parte del metodo interact(), interact_().
//      primero se llama a showTitles, que a su vez llama a showTitle() para imprimir el titulo del padre
//      y a continuacion imprimi el titulo de las opciones que añadimoos anteriormente llamando al metodo
//      showTitle() de cada Option.
//      
//      una vez impreso por pantala el titulo del menu y el titulo de las opciones se llama finalmente a execChoosedOption(),
//      que pide por pantalla que indique qué opcion se quiere ejecutar, indexa el array de options con la respuesta y eejcuta
//      el metodo interact() de la opcion elegida.
//      
//      el metodo interact() de la opcion es un metodo abtracto impplementado en el la especificación concreta
//      de cada opcion, y como las opciones concretas conocen al modelo ya pueden hacer operacions sobre el, en este caso de 
//      lectura para luego imprimir por pantalla.

