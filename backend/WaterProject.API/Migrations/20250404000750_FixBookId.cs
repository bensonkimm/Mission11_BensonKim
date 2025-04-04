using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WaterProject.API.Migrations
{
    /// <inheritdoc />
    public partial class FixBookId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Books",
                newName: "BookID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BookID",
                table: "Books",
                newName: "Id");
        }
    }
}
