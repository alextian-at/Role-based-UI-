using System.Web;
using System.Web.Optimization;

namespace Accela.RBUI
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/Jquery/jquery-{version}.js",
                        "~/Scripts/Jquery/jquery.placeholder.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryui").Include(
                        "~/Scripts/Jquery/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/Jquery/jquery.unobtrusive*",
                        "~/Scripts/Jquery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/SystemJs/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/angular").Include(
                        "~/Scripts/Angular/angular.js",
                        "~/Scripts/Angular/angular-resource.js",
                         "~/Scripts/CommonJs/ui-bottstrap/ui-bootstrap-tpls-0.6.0.js",
                         "~/Scripts/CommonJs/ProcesseBar/jquery.processing.plugin.js"
                        ));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap-ltr").Include(
                        "~/Scripts/Bootstrap/bootstrap.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap-rtl").Include(
                        "~/Scripts/Bootstrap/bootstrap-rtl.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/site.css",
                "~/Content/Site-responsive.css",
                "~/Content/font-awesome.min.css"));

            bundles.Add(new StyleBundle("~/Content/themes/base/css").Include(
                        "~/Content/themes/base/jquery.ui.core.css",
                        "~/Content/themes/base/jquery.ui.resizable.css",
                        "~/Content/themes/base/jquery.ui.selectable.css",
                        "~/Content/themes/base/jquery.ui.accordion.css",
                        "~/Content/themes/base/jquery.ui.autocomplete.css",
                        "~/Content/themes/base/jquery.ui.button.css",
                        "~/Content/themes/base/jquery.ui.dialog.css",
                        "~/Content/themes/base/jquery.ui.slider.css",
                        "~/Content/themes/base/jquery.ui.tabs.css",
                        "~/Content/themes/base/jquery.ui.datepicker.css",
                        "~/Content/themes/base/jquery.ui.progressbar.css",
                        "~/Content/themes/base/jquery.ui.theme.css"
                        ));

            bundles.Add(new StyleBundle("~/Content/bootstrap-ltr").Include(
                "~/Content/bootstrap/bootstrap.css",
                "~/Content/site-ar.css"));

            bundles.Add(new StyleBundle("~/Content/bootstrap-rtl").Include(
                "~/Content/bootstrap/bootstrap-rtl.css"));

            bundles.Add(new StyleBundle("~/Content/site-rtl").Include(
                "~/Content/site-ar-rtl.css"));

            bundles.Add(new ScriptBundle("~/bundles/appscript").IncludeDirectory("~/Scripts/App/", "*.js", true));

        }
    }
}