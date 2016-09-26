var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


router.get('/searchtool', function(req, res){
var experiments=["ciaoooooo", "cazzoooo"];
    /*var string = "<option value=\"\" selected=\"selected\" ></option>";
    */mongoose.connection.on('open', function(ref){
     experiments =mongoose.connection.db.listCollections().toArray(function(err, names) {
         if (err) {
             console.log(err);
         }
         else {
             names.forEach(function(e,i,a) {
                 /*string= string+"<option value=\""+ e.name+"\" >"+e.name+"</option>"*/
                 experiments.push(e.name);
             });
         }
         res.json(experiments);
     });
 });
    /*res.set('Content-Type', 'text/html');
    res.send(new Buffer(string));
*/

/*    for(var i=0; i<experimentlist.length; i++){
        console.log(experimentlist[i]);
    }*/


})

module.exports = router;
