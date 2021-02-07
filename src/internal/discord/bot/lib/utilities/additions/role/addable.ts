export default (_MoyaiLib: any) => {
	Object.defineProperty(_MoyaiLib.Role.prototype, "addable", {
		get: function() {
			const clientMember = this.guild.members.get(this.guild.shard.client.user.id);
			return clientMember.permission.has("manageRoles") && clientMember.highestRole.higherThan(this);
		}
	});
}