/**
 * @lends Boxsplash.controller.ViewPrepCommand.prototype
 */
Ext.namespace('Boxsplash.controller');
Boxsplash.controller.ViewPrepCommand = Ext.extend(Puremvc.patterns.SimpleCommand, {
  /**
   * @class <code>SimpleCommand</code> subclass that is
   * responsible for preparing the primary View.  This is where the
   * <code>Mediator</code> subclass assigned to the Shell is
   * registered with the <code>Model</code>.
   *
   * @extends Puremvc.patterns.SimpleCommand
   *
   * @see Boxsplash.view.ShellMediator
   * @see Boxsplash.view.components.Shell
   *
   * @author Justin Wilaby
   * @author Tony DeFusco
   *
   * @constructs
   */
  constructor: function() {
    Boxsplash.controller.ViewPrepCommand.superclass.constructor.call(this);
  },

  /**
   * Executes the command. A <code>Notification</code>
   * instance will always be present as an argument to
   * this method.
   * @param {Puremvc.patterns.Notification} notification The notification containing
   * the view instance in the <code>body</code> property.
   * (In this case our Shell)
   */
  execute: function(notification /* Notification */) {
    // Extract the Shell instance
    var shell = notification.getBody();

    // Register the ShellMediator passing the Shell
    // instance to its constructor.
    this.facade.registerMediator(new Boxsplash.view.ShellMediator(shell));
  }
});
