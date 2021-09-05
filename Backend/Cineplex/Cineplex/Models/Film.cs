using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Cineplex.Models
{
    [Table("film")]
    public class Film
    {

        [Key]
        [Required]
        public string cod_film { get; set; }
        public string titolo { get; set; }
        public string regista { get; set; }
        public string genere { get; set; }
        public string trama { get; set; }
        public string anno { get; set; }
        public string data_inizio { get; set; }
        public string data_fine { get; set; }
        public string prezzo { get; set; }
        public string poster { get; set; }
        public string cod_cinema { get; set; }

        public string nome { get; set; }
        public string indirizzo { get; set; }
        public string provincia { get; set; }
        public int capienza { get; set; }
        public int spazioLibero { get; set; }
    }
}
