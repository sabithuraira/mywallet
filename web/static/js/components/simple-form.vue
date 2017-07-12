<template>  
    <form role='form' id='data-form'>
        <div>
            <div class='form-group'>
            <p>Name</p>
            <input type='hidden' id='form-id'>
            <input type='text' id='form-name' class='form-control input-sm' placeholder='Enter name'>
            </div>

            <div class='form-group'>
            <p>Note</p>
            <input type='text' id='form-note' class='form-control input-sm' placeholder='Enter note'>
            </div>
        </div>

        <div class='box-footer'>
            <button type='submit' id='btn-submit' class='btn btn-primary'>Submit</button>
        </div>
    </form>
</template>

<script>
export default{
    
}
</script>
