import React, {Component, PropTypes} from 'react';

function createEditor(config) {
  let editor = null;

  const hideSplash = function hideSplash() {
    // Fades-out the splash screen
    const splash = document.getElementById('splash');

    if (splash !== null) {
      try {
        mxEvent.release(splash);
        mxEffects.fadeOut(splash, 100, true);
      }
      catch (ex) {
        splash.parentNode.removeChild(splash);
      }
    }
  };

  try {
    if (!mxClient.isBrowserSupported()) {
      mxUtils.error('Browser is not supported!', 200, false);
    }
    else {
      mxObjectCodec.allowEval = true;
      const node = mxUtils.load(config).getDocumentElement();
      editor = new mxEditor(node);
      mxObjectCodec.allowEval = false;

      // Adds active border for panning inside the container
      editor.graph.createPanningManager = function createPanningManager() {
        const pm = new mxPanningManager(this);
        pm.border = 30;

        return pm;
      };

      editor.graph.allowAutoPanning = true;
      editor.graph.timerAutoScroll = true;

      // Updates the window title after opening new files
      const title = document.title;
      const funct = function(sender) {
        document.title = title + ' - ' + sender.getTitle();
      };

      editor.addListener(mxEvent.OPEN, funct);

      // Prints the current root in the window title if the
      // current root of the graph changes (drilling).
      editor.addListener(mxEvent.ROOT, funct);
      funct(editor);

      // editor.setStatus('Status');

      // Shows the application
      hideSplash();
    }
  }
  catch (ex) {
    hideSplash();

    // Shows an error message if the editor cannot start
    mxUtils.alert('Cannot start application: ' + ex.message);
    throw ex; // for debugging
  }

  return editor;
}
function onInit(editor) {
  // Enables rotation handle
  mxVertexHandler.prototype.rotationEnabled = true;

  // Enables guides
  mxGraphHandler.prototype.guidesEnabled = true;

  // Alt disables guides
  mxGuide.prototype.isEnabledForEvent = function(evt)
  {
    return !mxEvent.isAltDown(evt);
  };

  // Enables snapping waypoints to terminals
  mxEdgeHandler.prototype.snapToTerminals = true;

  // Defines an icon for creating new connections in the connection handler.
  // This will automatically disable the highlighting of the source vertex.
  mxConnectionHandler.prototype.connectImage = new mxImage('../images/connector.gif', 16, 16);

  // Enables connections in the graph and disables
  // reset of zoom and translate on root change
  // (ie. switch between XML and graphical mode).
  editor.graph.setConnectable(true);

  // Clones the source if new connection has no target
  editor.graph.connectionHandler.setCreateTarget(true);

  // Create select actions in page
  let node = document.getElementById('mainActions');
  const buttons = ['group', 'ungroup', 'cut', 'copy', 'paste', 'delete', 'undo', 'redo', 'print', 'show'];

  // Only adds image and SVG export if backend is available
  // NOTE: The old image export in mxEditor is not used, the urlImage is used for the new export.
  if (editor.urlImage != null) {
    // Client-side code for image export
    const exportImage = function(editor) {
      const graph = editor.graph;
      const scale = graph.view.scale;
      const bounds = graph.getGraphBounds();

      // New image export
      const xmlDoc = mxUtils.createXmlDocument();
      const root = xmlDoc.createElement('output');
      xmlDoc.appendChild(root);

      // Renders graph. Offset will be multiplied with state's scale when painting state.
      const xmlCanvas = new mxXmlCanvas2D(root);
      xmlCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
      xmlCanvas.scale(scale);

      const imgExport = new mxImageExport();
      imgExport.drawState(graph.getView().getState(graph.model.root), xmlCanvas);

      // Puts request data together
      const w = Math.ceil(bounds.width * scale + 2);
      const h = Math.ceil(bounds.height * scale + 2);
      const xml = mxUtils.getXml(root);

      // Requests image if request is valid
      if (w > 0 && h > 0)
      {
        const name = 'export.png';
        const format = 'png';
        const bg = '&bg=#FFFFFF';

        new mxXmlRequest(editor.urlImage, 'filename=' + name + '&format=' + format +
          bg + '&w=' + w + '&h=' + h + '&xml=' + encodeURIComponent(xml)).
        simulate(document, '_blank');
      }
    };

    editor.addAction('exportImage', exportImage);

    // Client-side code for SVG export
    const exportSvg = function(editor) {
      const graph = editor.graph;
      const scale = graph.view.scale;
      const bounds = graph.getGraphBounds();

      // Prepares SVG document that holds the output
      const svgDoc = mxUtils.createXmlDocument();
      const root = (svgDoc.createElementNS != null) ?
        svgDoc.createElementNS(mxConstants.NS_SVG, 'svg') : svgDoc.createElement('svg');

      if (root.style != null)
      {
        root.style.backgroundColor = '#FFFFFF';
      }
      else
      {
        root.setAttribute('style', 'background-color:#FFFFFF');
      }

      if (svgDoc.createElementNS == null)
      {
        root.setAttribute('xmlns', mxConstants.NS_SVG);
      }

      root.setAttribute('width', Math.ceil(bounds.width * scale + 2) + 'px');
      root.setAttribute('height', Math.ceil(bounds.height * scale + 2) + 'px');
      root.setAttribute('xmlns:xlink', mxConstants.NS_XLINK);
      root.setAttribute('version', '1.1');

      // Adds group for anti-aliasing via transform
      const group = (svgDoc.createElementNS != null) ?
        svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
      group.setAttribute('transform', 'translate(0.5,0.5)');
      root.appendChild(group);
      svgDoc.appendChild(root);

      // Renders graph. Offset will be multiplied with state's scale when painting state.
      const svgCanvas = new mxSvgCanvas2D(group);
      svgCanvas.translate(Math.floor(1 / scale - bounds.x), Math.floor(1 / scale - bounds.y));
      svgCanvas.scale(scale);

      const imgExport = new mxImageExport();
      imgExport.drawState(graph.getView().getState(graph.model.root), svgCanvas);

      const name = 'export.svg';
      const xml = encodeURIComponent(mxUtils.getXml(root));

      new mxXmlRequest(editor.urlEcho, 'filename=' + name + '&format=svg' + '&xml=' + xml).simulate(document, "_blank");
    };

    editor.addAction('exportSvg', exportSvg);

    buttons.push('exportImage');
    buttons.push('exportSvg');
  }

  for (let i = 0; i < buttons.length; i++)
  {
    const button = document.createElement('button');
    mxUtils.write(button, mxResources.get(buttons[i]));

    const factory = function(name)
    {
      return function()
      {
        editor.execute(name);
      };
    };

    mxEvent.addListener(button, 'click', factory(buttons[i]));
    node.appendChild(button);
  }

  const additionalActions = ['selectAll', 'selectNone', 'selectVertices', 'selectEdges', 'zoomIn', 'zoomOut', 'actualSize', 'fit'];

  node = document.getElementById('additionalActions');

  for (let i = 0; i < additionalActions.length; i++)
  {
    const button = document.createElement('button');
    mxUtils.write(button, mxResources.get(additionalActions[i]));

    const factory = function(name)
    {
      return function()
      {
        editor.execute(name);
      };
    };

    mxEvent.addListener(button, 'click', factory(additionalActions[i]));
    node.appendChild(button);
  }
}

export default class Room extends Component {

  static propTypes = {
    room: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (socket && __CLIENT__) {
      const room = this.props.room;

      const editor = createEditor('../config/diagrameditor.xml');

      onInit(editor);

      const graph = editor.graph;
      const model = graph.getModel();

      model.local = true;

      if (room && room.diagram) {
        setModel(room.diagram);
      }

      model.addListener(mxEvent.CHANGE, function(sender, evt) {
        if (model.local) {
          const changes = evt.getProperty('edit').changes;

          mxEffects.animateChanges(graph, changes);

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
    }
  }

  componentWillUnmount() {
    if (socket) {
      // socket.removeListener('DIAGRAM', this.onMessageReceived);
    }
  }

  render() {
    const style = require('./Diagram.scss');

    return (
      <div className={style.diagram}>
        <div className={style.actions}>
          <div className="row">
            <div id="mainActions" className={`${style.mainActions} col-md-12`}></div>
          </div>
          <div className="row">
            <div id="additionalActions" className={`${style.additionalActions} col-md-12`}></div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table>
              <tbody>
              <tr>
                <td id="toolbar" className={`${style.toolbar} col-md-1 col-sm-1 col-xs-1`}>
                </td>
                <td className={`col-md-11 col-sm-11 col-xs-11 ${style['col-without-padding']}`}>
                  <div
                    id="graph"
                    className={style.graph}
                    style={{backgroundImage: `url(${'images/grid.gif'})`}}>
                    <center id="splash" style={{paddingTop: '230px'}}>
                      <img src="images/loading.gif"/>
                    </center>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
