using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class NotificationHub: Hub
    {
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetHttpContext()?.Request.Query["userId"].FirstOrDefault();
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
                Context.Items["userId"] = userId;
            }
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception ex)
        {
            var userId = Context.Items["userId"] as string;
            if (!string.IsNullOrEmpty(userId))
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, userId);
            }
            await base.OnDisconnectedAsync(ex);
        }

        public async Task NotifyUser(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                await Clients.Group(userId).SendAsync("NewNotification");
            }
        }
    }
}
