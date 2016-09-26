var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation

// define schema

var rowdnaseqSchema = new Schema({
    chr: String,
    start: String,
    end: String,
    strand: String,
    hugo_symbol: String,
    entrez_gene_id: String,
    variant_classification: String,
    variant_type: String,
    reference_allele: String,
    tumor_seq_allele1: String,
    tumor_seq_allele2: String,
    dbsnp_rs: String,
    tumor_sample_barcode: String,
    matched_norm_sample_barcode: String,
    match_norm_seq_allele1: String,
    match_norm_seq_allele2: String,
    matched_norm_sample_uuid: String

});
var informationSchema = new Schema({
    name:String,
    data: String
});

var dnaseqSchema = new Schema({
    tumor : String,
    aliquote: String,
    person_id: String,
    tissue: String,
    information: [informationSchema],
    fields: [rowdnaseqSchema]
});

var dnaseq=mongoose.model('dnaseq', dnaseqSchema);

module.exports= dnaseq;

