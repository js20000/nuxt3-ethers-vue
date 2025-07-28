<template>
  <div class="erc20-balance">
    {{amount}}
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
const props=defineProps({
  modelValue:String,
  userAddress: String,
  contractAddress:String
})
const  amount=ref('')
watch(() => props.userAddress,  ( ) => {
   loadData()
})
watch(() => props.contractAddress,  ( ) => {
  loadData()
})
const emit=defineEmits(['update:modelValue'])
const loadData=async ()=>{
  if(props.contractAddress && props.userAddress){
    const {loadBalance,balance} = useToken(props.contractAddress)
    await loadBalance(props.userAddress)
    amount.value=balance.value
    emit('update:modelValue', amount.value)
  }
}
onMounted(() => {
  loadData()
})
</script>