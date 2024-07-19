<template>
    <header class="header">
        <h2 class="sna-label">Inventory Panel</h2>
    </header>
</template>

<script>
export default {
    name: 'Header'
}
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    background: #374974;
    height: var(--header-height);
    width: 100%;
    
    .sna-label{
        flex: 1;
        color: #e2e2e2;
        align-self: center;
        margin-left: 1rem;
    }
 
}

</style>