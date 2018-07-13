<template>
    <div>

    </div>
</template>
<script>
import {authFunction as auth} from '../../src/js/auth.js'
export default {
    created(){
        auth.payUrl();
    }
}
</script>
