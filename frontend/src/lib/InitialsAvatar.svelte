<script>
    export let name
    export const colors = ["bg-blue-400", "bg-red-400", "bg-purple-400", "bg-green-400", "bg-orange-400", "bg-stone-400"]
</script>

<div class="w-full h-full aspect-square rounded-full flex items-center justify-center {colors[name.split("").reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length]}">
    <p class="text-white">{name.split(" ").reduce((a, b) => a.charAt(0) + b.charAt(0), "")}</p>
</div>