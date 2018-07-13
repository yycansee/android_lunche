<template>
    <div>

    </div>
</template>
<script>
import {getplayurl} from '../../js/getplayurl.js'
export default {
    created(){
        getplayurl.start();
    }
}
</script>
