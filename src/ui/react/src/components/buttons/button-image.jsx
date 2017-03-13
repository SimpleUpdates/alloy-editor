(function () {
    'use strict';

    /**
     * The ButtonImage class inserts an image to the content.
     *
     * @class ButtonImage
     */
    var ButtonImage = React.createClass({
        // Allows validating props being passed to the component.
        propTypes: {
            /**
             * The editor instance where the component is being used.
             *
             * @property {Object} editor
             */
            editor: React.PropTypes.object.isRequired,

            /**
             * The label that should be used for accessibility purposes.
             *
             * @property {String} label
             */
            label: React.PropTypes.string,

            /**
             * The tabIndex of the button in its toolbar current state. A value other than -1
             * means that the button has focus and is the active element.
             *
             * @property {Number} tabIndex
             */
            tabIndex: React.PropTypes.number
        },

        // Lifecycle. Provides static properties to the widget.
        statics: {
            /**
             * The name which will be used as an alias of the button in the configuration.
             *
             * @static
             * @property {String} key
             * @default image
             */
            key: 'image'
        },

        /**
         * Lifecycle. Renders the UI of the button.
         *
         * @method render
         * @return {Object} The content which should be rendered.
         */
        render: function() {
            var inputSyle = {display: 'none'};

            return (
                <div>
                    <button aria-label={AlloyEditor.Strings.image} className="ae-button" data-type="button-image" onClick={this.handleClick} tabIndex={this.props.tabIndex} title={AlloyEditor.Strings.image}>
                    	<svg xmlns="http://www.w3.org/2000/svg" viewBox="12 14 24 20" data-trimmed="trimmed" width="1em" height="1em" className="icon" data-identifier="glyphicons-picture"><path d="M35.125 14h-22.25a.875.875 0 0 0-.875.875v18.25c0 .483.392.875.875.875h22.25a.875.875 0 0 0 .875-.875v-18.25a.875.875 0 0 0-.875-.875zM34 25.578L30.474 22s-.974-1-1.942-1c-.969 0-1.91 1-1.91 1s-2.637 3.011-3.631 4.004c1.604.684 4.03 4.635 2.176 3.456-1.854-1.179-5.104-2.459-5.104-2.459L14 31V16h20v9.578zM15.813 20c0-1.205.98-2.187 2.187-2.187a2.188 2.188 0 0 1 0 4.374A2.19 2.19 0 0 1 15.813 20z"/></svg>
                    </button>

                    <input accept="image/*" onChange={this._onInputChange} ref="fileInput" style={inputSyle} type="file"/>
                </div>
            );
        },

        /**
         * Simulates click on the input element. This will open browser's native file open dialog.
         *
         * @method handleClick
         * @param {SyntheticEvent} event The received click event on the button.
         */
        handleClick: function(event) {
            ReactDOM.findDOMNode(this.refs.fileInput).click();
        },

        /**
         * On input change, reads the chosen file and fires an event `beforeImageAdd` with the image which will be added
         * to the content. The image file will be passed in the `imageFiles` property.
         * If any of the listeners returns `false` or cancels the event, the image won't be added to the content.
         * Otherwise, an event `imageAdd` will be fired with the inserted element into the editable area.
         * The passed params will be:
         * - `el` - the created img element
         * - `file` - the original image file from the input element
         *
         * @protected
         * @method _onInputChange
         */
        _onInputChange: function() {
            var inputEl = ReactDOM.findDOMNode(this.refs.fileInput);

            // On IE11 the function might be called with an empty array of
            // files. In such a case, no actions will be taken.
            if (!inputEl.files.length) {
                return;
            }

            var reader = new FileReader();
            var file = inputEl.files[0];

            reader.onload = function(event) {
                var editor = this.props.editor.get('nativeEditor');

                var result = editor.fire('beforeImageAdd', {
                    imageFiles: file
                });

                if (!!result) {
                    var el = CKEDITOR.dom.element.createFromHtml('<img src="' + event.target.result + '">');

                    editor.insertElement(el);

                    editor.fire('actionPerformed', this);

                    var imageData = {
                        el: el,
                        file: file
                    };


                    editor.fire('imageAdd', imageData);
                }
            }.bind(this);

            reader.readAsDataURL(file);

            inputEl.value = '';
        }

        /**
         * Fired before adding images to the editor.
         *
         * @event beforeImageAdd
         * @param {Array} imageFiles Array of image files
         */

        /**
         * Fired when an image is being added to the editor successfully.
         *
         * @event imageAdd
         * @param {CKEDITOR.dom.element} el The created image with src as Data URI
         * @param {File} file The image file
         */
    });

    AlloyEditor.Buttons[ButtonImage.key] = AlloyEditor.ButtonImage = ButtonImage;
}());