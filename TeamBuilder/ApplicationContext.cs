﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TeamBuilder.Models;

namespace TeamBuilder
{
	public class ApplicationContext: DbContext
	{
        public DbSet<User> Users { get; set; }
        public DbSet<UserTeam> UserTeams { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<UserSkill> UserSkills { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<TeamEvent> TeamEvents { get; set; }
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            //Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserTeam>()
                .HasKey(t => new { t.UserId, t.TeamId });

            modelBuilder.Entity<UserTeam>()
                .HasOne(ut => ut.User)
                .WithMany(u => u.UserTeams)
                .HasForeignKey(ut => ut.UserId);

            modelBuilder.Entity<UserTeam>()
                .HasOne(ut => ut.Team)
                .WithMany(u => u.UserTeams)
                .HasForeignKey(ut => ut.TeamId);

            modelBuilder.Entity<UserSkill>()
                .HasKey(t => new { t.UserId, t.SkillId });

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.User)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(us => us.UserId);

            modelBuilder.Entity<UserSkill>()
                .HasOne(us => us.Skill)
                .WithMany(u => u.UserSkills)
                .HasForeignKey(us => us.SkillId);

            modelBuilder.Entity<TeamEvent>()
                .HasKey(t => new { t.TeamId, t.EventId });

            modelBuilder.Entity<TeamEvent>()
                .HasOne(us => us.Team)
                .WithMany(u => u.TeamEvents)
                .HasForeignKey(us => us.TeamId);

            modelBuilder.Entity<TeamEvent>()
                .HasOne(us => us.Event)
                .WithMany(u => u.TeamEvents)
                .HasForeignKey(us => us.EventId);
        }
    }
}
