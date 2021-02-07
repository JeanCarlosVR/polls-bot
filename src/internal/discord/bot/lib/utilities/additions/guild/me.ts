export default (_MoyaiLib: any) => {
	Object.defineProperty(_MoyaiLib.Guild.prototype, "me", {
        get: function() {
          return this.members.get(this.shard.client.user.id);
        }
    });
}
