# How to Config Runtime?

First:

    gcloud services enable runtimeconfig.googleapis.com


Second:

    gcloud beta runtime-config configs create awesomeConfig

Third:

    gcloud beta runtime-config configs variables \
      set someKey "my-fancy-k3y" \
      --config-name awesomeConfig

Fourth:

    gcloud beta runtime-config configs variables \
      set somePass "my.super.fancy.pass" \
      --config-name awesomeConfig


Done :)

# Update config?

Actually, you can't update to config variable, you can only delete it or set (a new) variable. So, to delete (unset) the variable, you must send the following instructions in your console:

    gcloud beta runtime-config configs variables \
      unset somePass --config-name awesomeConfig

Then, go back to the third step :)