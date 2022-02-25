const marker = {
        icon: {
          layout: 'default#imageWithContent',
          imageHref: '',
          iconImageHref: '',
          imageSize: [62, 62],
          imageOffset: [-62, -62],
          contentLayout: '<svg class="icon icon-location in-map $[options.moreClassesForGodClasses]"><use href="#icon-location"/></svg>' 
        },
        props: {
          // hintContent: 'markerProps - hint',
        },
        options: {
          balloonMinWidth: 400,
          balloonMinHeight: 400,
        }
      }

export default marker
