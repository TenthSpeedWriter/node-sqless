module.exports = function (config, db_lexicon) {
    var self = this;
    
    this.c = this.create = db_lexicon.Create(config);
    this.r = this.read = db_lexicon.Read(config);
    this.u = this.update = db_lexicon.Update(config);
    this.d = this.delete = db_lexicon.Delete(config);
    
    return self;
};