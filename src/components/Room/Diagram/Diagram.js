import React, {Component, PropTypes} from 'react';

export default class Room extends Component {

  static propTypes = {
    room: PropTypes.object.isRequired,
    blockHeight: PropTypes.number.isRequired,
    hasPermission: PropTypes.func.isRequired
  };

  componentDidMount() {
    const {room, hasPermission} = this.props;

    if (socket && __CLIENT__) {
      (function()
      {
        const editorUiInit = EditorUi.prototype.init;

        EditorUi.prototype.init = function()
        {
          editorUiInit.apply(this, arguments);
          this.actions.get('export').setEnabled(false);

          const graph = this.editor.graph;
          const model = graph.getModel();

          model.local = true;

          if (room && room.diagram) {
            setModel(room.diagram);
          }

          model.addListener(mxEvent.CHANGE, function(sender, evt) {
            if (model.local) {
              const enc = new mxCodec();
              const node = enc.encode(model);

              socket.emit('DIAGRAM', room._id, mxUtils.getXml(node));
            }

            model.local = true;
          });

          socket.on('DIAGRAM', function(node){
            model.beginUpdate();

            try {
              setModel(node);
              model.local = false;
            }
            finally {
              model.endUpdate();
            }
          });

          function setModel(node) {
            const doc = mxUtils.parseXml(node);
            const codec = new mxCodec(doc);

            codec.decode(doc.documentElement, model);
          }
        };

        // Adds required resources (disables loading of fallback properties, this can only
        // be used if we know that all keys are defined in the language specific file)
        mxResources.loadDefaultBundle = false;
        const bundle = mxResources.getDefaultBundle(RESOURCE_BASE, mxLanguage) ||
          mxResources.getSpecialBundle(RESOURCE_BASE, mxLanguage);

        // Fixes possible asynchronous requests
        mxUtils.getAll([bundle, STYLE_PATH + '/default.xml'], function(xhr)
        {
          // Adds bundle text to resources
          mxResources.parse(xhr[0].getText());

          // Configures the default graph theme
          const themes = new Object();
          themes[Graph.prototype.defaultThemeName] = xhr[1].getDocumentElement();

          const container = document.getElementById('container');
          const isEditor = hasPermission('write');

          const editorUI = new EditorUi(new Editor(urlParams['chrome'] == '0', themes), container, null, isEditor);

          editorUI.actions.get('pageView').funct();
          editorUI.setGridColor('#A9C4EB');
          editorUI.editor.graph.setGridSize(15);
          editorUI.editor.graph.setEnabled(isEditor);

          /*setTimeout(() => exportImage(editorUI.editor), 3000);

          var exportImage = function(editor)
          {
            var graph = editor.graph;
            var scale = graph.view.scale;
            var bounds = graph.getGraphBounds();

            // New image export
            var xmlDoc = mxUtils.createXmlDocument();
            var root = xmlDoc.createElement('output');
            xmlDoc.appendChild(root);

            // Renders graph. Offset will be multiplied with state's scale when painting state.
            var xmlCanvas = new mxXmlCanvas2D(root);
            xmlCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
            xmlCanvas.scale(scale);

            var imgExport = new mxImageExport();
            imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

            // Puts request data together
            var w = Math.ceil(bounds.width * scale + 2);
            var h = Math.ceil(bounds.height * scale + 2);
            var xml = mxUtils.getXml(root);

            // Requests image if request is valid
            if (w > 0 && h > 0)
            {
              var name = 'export.png';
              var format = 'png';
              var bg = '&bg=#FFFFFF';

              new mxXmlRequest(editor.urlImage, 'filename=' + name + '&format=' + format +
                bg + '&w=' + w + '&h=' + h + '&xml=' + encodeURIComponent(xml)).
              simulate(document, '_blank');
            }
          };*/

        });
      })();
    }
  }

  componentWillUnmount() {
    if (socket) {
      // socket.removeListener('DIAGRAM', this.onMessageReceived);
    }
  }

  render() {
    const {blockHeight} = this.props;

    return (
      <div id="container" style={{height: `${blockHeight}px`, position: 'relative' }}></div>
    );
  }
}
