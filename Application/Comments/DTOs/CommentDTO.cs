namespace Application.Comments.DTOs
{
    public class CommentDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}