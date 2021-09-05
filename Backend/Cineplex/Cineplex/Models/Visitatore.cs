using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Cineplex.Models
{
    [Table("visitatore")]
    public class Visitatore
    {

        [Key]
        [Required]
        public string cod_visitatore { get; set; }
        [Required]
        public string cognome { get; set; }
        [Required]
        public string nome { get; set; }
        [Required]
        public string telefono { get; set; }
        [Required]
        public string email { get; set; }
        [Required]
        public string user { get; set; }
        [Required]
        public string psw { get; set; }


    }
}
