class connection {
    constructor(ip) {
        this.ip = ip;
        this.count = 0;
        this.date = Date.now();
        this.breaches = 0;
        this.timedOut = false;
    }
}

module.exports = {
    filterSession: class { // Main purpose is just to prevent bruteforcing of keys and id's
        constructor(maxCount, timeFrame, maxBreaches) {
            this.maxCount = maxCount;
            this.timeFrame = timeFrame;
            this.maxBreaches = maxBreaches;
            this.connections = [];
        }
    
        getConnection(options) {
            let result = {err_c: 404, err: true};
    
            if (options.ip) {
                this.connections.forEach(con => {
                    if (con.ip === options.ip) {
                        result = {err_c: 200, err: false, results: {conObj: con}};
                        return;
                    }
                })
            }
    
            return result;
        } 
    
        checkConnection(options) {
            let result = {err_c: 400, err: true}
    
            if (options.ip) {
                let con = this.getConnection(options);
    
                if (con.err === false) {
                    con = con.results.conObj;
    
                    if (con.timedOut === true) {
                        result = {err_c: 405, err: true, results: {conObj: con}};
                        return result;
                    }
        
                    if (con.count <= this.maxCount) {
                        con.count++;
                        if (Date.now() - con.Date > this.timeFrame) con.count = 0;
                        con.date = Date.now();
                        result = {err_c: 200, err: false, results: {conObj: con}};
                        return result;
                    } else {
                        con.breaches++;
                        result = {err_c: 405, err: true, results: {conObj: con}};
        
                        if (con.breaches > this.maxBreaches) con.timedOut = true;
                        return result;
                    }
                } else {
                    con = new connection(options.ip);
                    this.connections.push(con);
                    result = {err_c: 200, err: false, results: {conObj: con}};
                }
            }
    
            return result;
        }
    }
}