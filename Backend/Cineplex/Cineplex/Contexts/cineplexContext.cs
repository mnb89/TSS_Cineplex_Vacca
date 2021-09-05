using Cineplex.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SQLite;
using System.Linq;
using System.Threading.Tasks;

namespace Cineplex.Contexts
{
    public class cineplexContext : DbContext
    {
        public virtual DbSet<Visitatore> Visitatori { get; set; }
        //public virtual DbSet<Cinema> Cinemi { get; set; }
        public virtual DbSet<Film> Films { get; set; }
        public virtual DbSet<Biglietto> Biglietti { get; set; }

        public readonly string CS;
        public SQLiteConnection con;


        public cineplexContext(DbContextOptions<cineplexContext> options): base(options)
        {
            CS = "Data Source = F:\\CORSO TSS\\COMPITO FINALE\\TSS_Cineplex_Vacca\\Backend\\cineplex.db";
            con = new SQLiteConnection(CS);
        }


    }
}
