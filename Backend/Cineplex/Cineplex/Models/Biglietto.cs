using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Cineplex.Models
{
    [Table("biglietto")]
    public class Biglietto
    {
        [Key]
        [Index]
        public int cod_operazione { get; set; }

        public string cod_visitatore { get; set; }
        public string ora_proiezione { get; set; }
        public string data { get; set; }
        public string tipo_pagamento { get; set; }
        public int qta { get; set; }
        public string cod_film { get; set; }


        public string titolo { get; set; }
        public string cinema { get; set; }
        public string prv { get; set; }



    }
}
