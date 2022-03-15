module.exports = { // Used only for mysql-handler script......................
    err: class {
        constructor(id) {
            this.id = id;
            this.err = false;
            this.description = "";
            this.getDescription();
        }

        getDescription() {
            switch (this.id) {
                case '200': 
                    this.description = "OK";
                    this.err = false;
                    break;
                case '404':
                    this.description = "Not found.";
                    this.err = true;
                    break;
                case '405':
                    this.description = "Method not allowed.";
                    this.err = true;
                    break;
                case '400': 
                    this.description = "Bad request.";
                    this.err = true;
                    break;
                case '403': 
                    this.description = "Forbidden";
                    this.err = true;
                    break;
                case '500':
                    this.description = "Server error";
                    this.err = true;
                    break;
            }
        }
    }
}