export const updateShow = async (show) => {
    await $.ajax({
        url: './slideshow/Show/' + show.id,
        data: {title: show.title, active: show.active},
        type: 'put',
        dataType: 'json',
        success: function() {
          
        }.bind(this),
        error: function(req, err) {
          alert("Failed to save data.")
          console.error(req, err.toString());
        }.bind(this)
      });
}