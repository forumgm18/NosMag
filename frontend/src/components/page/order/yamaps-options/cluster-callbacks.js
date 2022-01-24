const clusterCallbacks = {
        1:{
          // mouseenter: this.clusterMouseEnter,
          // mouseleave: this.clusterMouseLeave,
          mouseenter: function(e){
            // e.get('target').options.set('iconColor', '#DD5500')
            console.log (e.get('target').getOverlaySync())
            
            
            },
          mouseleave: function(e){e.get('target').options.set('iconColor', '#326FCA')},
        }
      } 
export default clusterCallbacks
