<template>
    <div class="modal-overlay" v-if="showModal">
      <div class="modal-content">
        <h2>Confirm Status Change</h2>
        <p>Are you sure you want to change the status?</p>
        <div class="modal-buttons">
          <button @click="confirmStatusChange(true)">Yes</button>
          <button @click="confirmStatusChange(false)">No</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: Boolean,
    },
    methods: {
      confirmStatusChange(confirm) {
        this.$emit('status-change-confirmed', confirm);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Modal overlay styles */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  /* Modal content styles */
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  
  /* Modal button styles */
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  </style>
  